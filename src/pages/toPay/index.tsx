import { List } from "@refinedev/antd";
import { Table, Typography, Checkbox, Button, Modal, message } from "antd";
import { useList, useCreate, useUpdate } from "@refinedev/core";
import { useMemo, useState } from "react";

const { Text } = Typography;

interface Driver {
    id: string;
    legalname: string;
    phonenumber: string;
}

interface DriverTotal {
    driver_id: string;
    name: string;
    phone_number: string;
    amount: number;
    rides: string[];
    rideDetails: RideDetail[];
    unpaidAmount: number;
}

interface RideDetail {
    ride_id: string;
    fare: number;
    origin: string;
    destination: string;
    date: string;
    payment_status: string;
}

const ToPay = () => {
    const { data: ridesData, isLoading: ridesLoading } = useList({
        resource: "rides",
        meta: {
            select: "*",
        },
    });

    const { data: driversData, isLoading: driversLoading } = useList({
        resource: "driver",
        meta: {
            select: "*",
        },
    });

    const { mutate: createPaidDriver } = useCreate();
    const { mutate: updateRide } = useUpdate();
    const { refetch: refetchRides } = useList({
        resource: "rides",
        meta: {
            select: "*",
        },
    });

    const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState<DriverTotal[] | null>(null);

    const { driverTotals, overallTotal, totalRides } = useMemo(() => {
        if (!ridesData?.data || !driversData?.data) {
            return { driverTotals: [], overallTotal: 0, totalRides: 0 };
        }

        const driversMap = driversData.data.reduce((acc: Record<string, Driver>, driver: Driver) => {
            acc[driver.id] = driver;
            return acc;
        }, {});

        const totalsMap = ridesData.data.reduce((acc, ride) => {
            if (ride.driver_id) {
                const fareAmount = Number(ride.fare_price) || 0;
                const driver = driversMap[ride.driver_id];

                if (!acc[ride.driver_id]) {
                    acc[ride.driver_id] = {
                        driver_id: ride.driver_id,
                        name: driver?.legalname || 'Unknown',
                        phone_number: driver?.phonenumber || 'N/A',
                        amount: 0,
                        unpaidAmount: 0,
                        rides: [],
                        rideDetails: []
                    };
                }

                acc[ride.driver_id].amount += fareAmount;
                if (ride.payment_status === "not paid") {
                    acc[ride.driver_id].unpaidAmount += fareAmount;
                }
                acc[ride.driver_id].rides.push(ride.ride_id);
                acc[ride.driver_id].rideDetails.push({
                    ride_id: ride.ride_id,
                    fare: fareAmount,
                    origin: ride.origin_address,
                    destination: ride.destination_address,
                    date: new Date(ride.created_at).toLocaleDateString(),
                    payment_status: ride.payment_status
                });
            }
            return acc;
        }, {});

        const driverTotalsArray = Object.values(totalsMap).filter(
            (driver: any) => driver.rides.length > 0
        );
        
        const total = driverTotalsArray.reduce((sum, driver) => sum + driver.unpaidAmount, 0);
        const totalUnpaidRides = driverTotalsArray.reduce(
            (sum, driver) => sum + driver.rideDetails.filter(ride => ride.payment_status === "not paid").length,
            0
        );

        return {
            driverTotals: driverTotalsArray,
            overallTotal: total,
            totalRides: totalUnpaidRides
        };
    }, [ridesData?.data, driversData?.data]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("rw-RW", {
            style: "currency",
            currency: "RWF",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleCheckboxChange = (driver_id: string, checked: boolean) => {
        if (checked) {
            setSelectedDrivers((prev) => [...prev, driver_id]);
        } else {
            setSelectedDrivers((prev) => prev.filter((id) => id !== driver_id));
        }
    };

    const handleSendToPaidDrivers = () => {
        const selectedDriversData = driverTotals.filter((driver) =>
            selectedDrivers.includes(driver.driver_id)
        );

        if (selectedDriversData.length === 0) {
            message.warning("No drivers selected!");
            return;
        }

        setModalData(selectedDriversData);
        setModalVisible(true);
    };

    const handleSubmitPaidDrivers = async () => {
        if (!modalData) {
            message.error("No drivers selected");
            return;
        }

        try {
            for (const driver of modalData) {
                const unpaidRides = driver.rideDetails
                    .filter(ride => ride.payment_status === "not paid")
                    .map(ride => ride.ride_id);

                // Update rides status
                for (const rideId of unpaidRides) {
                    try {
                        const updateResult = await updateRide({
                            resource: "rides",
                            id: rideId,
                            meta: {
                                select: "*",
                            },
                            values: {
                                payment_status: "paid"
                            },
                        });

                        if (!updateResult) {
                            throw new Error(`Failed to update ride ${rideId}`);
                        }
                        message.success(`Updated ride ${rideId}`);
                    } catch (error) {
                        console.error(`Error updating ride ${rideId}:`, error);
                        throw error;
                    }
                }

                // Create paid_drivers record
                try {
                    await createPaidDriver({
                        resource: "paid_drivers",
                        values: {
                            phone_number: driver.phone_number,
                            driver_id: driver.driver_id,
                            name: driver.name,
                            amount: driver.unpaidAmount
                        },
                    });
                    message.success(`Payment record created for ${driver.name}`);
                } catch (error) {
                    console.error(`Error creating paid driver record for ${driver.name}:`, error);
                    throw error;
                }
            }

            message.success("All payments processed successfully!");
            setModalVisible(false);
            setSelectedDrivers([]);
            await refetchRides();
        } catch (error: any) {
            message.error(error.message || "Error recording payments");
            console.error("Error:", error);
        }
    };




    return (
        <List breadcrumb={false}>
            <Table
                dataSource={driverTotals}
                loading={ridesLoading || driversLoading}
                pagination={{ pageSize: 12 }}
                rowKey="driver_id"
                expandable={{
                    expandedRowRender: (record) => (
                        <Table
                            dataSource={record.rideDetails}
                            pagination={false}
                            size="small"
                        >
                            <Table.Column title="Date" dataIndex="date" />
                            <Table.Column title="From" dataIndex="origin" />
                            <Table.Column title="To" dataIndex="destination" />
                            <Table.Column 
                                title="Fare" 
                                dataIndex="fare"
                                render={(value) => formatCurrency(value)}
                            />
                            <Table.Column
                                title="Status"
                                dataIndex="payment_status"
                                render={(status) => (
                                    <Text type={status === "paid" ? "success" : "warning"}>
                                        {status}
                                    </Text>
                                )}
                            />
                        </Table>
                    ),
                }}
            >
                <Table.Column
                    title="Select"
                    render={(text, record) => (
                        <Checkbox
                            onChange={(e) => handleCheckboxChange(record.driver_id, e.target.checked)}
                            checked={selectedDrivers.includes(record.driver_id)}
                        />
                    )}
                />
                <Table.Column
                    title="Driver Name"
                    dataIndex="name"
                    sorter={(a, b) => a.name.localeCompare(b.name)}
                />
                <Table.Column title="Phone Number" dataIndex="phone_number" />
                <Table.Column
                    title="Total Unpaid Fare"
                    dataIndex="unpaidAmount"
                    render={(value) => formatCurrency(value)}
                    sorter={(a, b) => a.unpaidAmount - b.unpaidAmount}
                />
                <Table.Column
                    title="Total Rides"
                    dataIndex="rides"
                    render={(rides) => rides.length}
                    sorter={(a, b) => a.rides.length - b.rides.length}
                />
            </Table>

            <div
                style={{
                    padding: "20px",
                    textAlign: "right",
                    borderTop: "2px solid #f0f0f0",
                    marginTop: "20px",
                }}
            >
                <Text strong style={{ fontSize: "16px", marginRight: "20px" }}>
                    Total Unpaid Rides: {totalRides}
                </Text>
                <Text strong style={{ fontSize: "20px", marginRight: "20px" }}>
                    Overall Unpaid Total: {formatCurrency(overallTotal)}
                </Text>
                <Button
                    type="primary"
                    onClick={handleSendToPaidDrivers}
                    disabled={selectedDrivers.length === 0}
                >
                    Mark Selected as Paid
                </Button>
            </div>

            <Modal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleSubmitPaidDrivers}
                title="Confirm Payment"
                width={600}
            >
                <div>
                    {modalData && modalData.map((driver) => (
                        <div key={driver.driver_id} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #f0f0f0" }}>
                            <p><strong>Driver:</strong> {driver.name}</p>
                            <p><strong>Phone:</strong> {driver.phone_number}</p>
                            <p><strong>Unpaid Rides:</strong> {driver.rideDetails.filter(ride => ride.payment_status === "not paid").length}</p>
                            <p><strong>Amount to Pay:</strong> {formatCurrency(driver.unpaidAmount)}</p>
                        </div>
                    ))}
                </div>
            </Modal>
        </List>
    );
};

export default ToPay;