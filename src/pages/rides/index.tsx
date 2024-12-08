import { List } from "@refinedev/antd";
import { Table, Space, Tag } from "antd";
import { EditButton, DeleteButton } from "@refinedev/antd";
import { useList } from "@refinedev/core";

const Rides = () => {
    const { data, isLoading } = useList({
        resource: "rides",
        meta: {
            select: "*", 
        },
    });

    return (
        <List breadcrumb={false}>
            <Table
                dataSource={data?.data}
                loading={isLoading}
                pagination={{ pageSize: 12 }}
                rowKey="ride_id"
            >
                <Table.Column
                    dataIndex="destination_address"
                    title="Destination"
                />
                <Table.Column
                    dataIndex="origin_address"
                    title="Start Location"
                />
                <Table.Column
                    dataIndex="ride_time"
                    title="Ride Time"
                />
                <Table.Column
                    dataIndex="fare_price"
                    title="Fare Price"
                />
                <Table.Column
                    dataIndex="is_completed"
                    title="Status"
                    render={(value) =>
                        value ? (
                            <Tag color="green">Completed</Tag>
                        ) : (
                            <Tag color="red">Pending</Tag>
                        )
                    }
                />
                <Table.Column
                    dataIndex="payment_status"
                    title="Payment Status"
                    render={(value) =>
                        value === "paid" ? (
                            <Tag color="green">Paid</Tag>
                        ) : (
                            <Tag color="orange">Not Paid</Tag>
                        )
                    }
                />
            </Table>
        </List>
    );
};

export default Rides;
