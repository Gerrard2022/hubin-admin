import { DollarOutlined } from "@ant-design/icons";
import { Area, AreaConfig } from "@ant-design/plots";
import { Card } from "antd";
import { useList } from "@refinedev/core";
import { Text } from "../text";

export const RideChart = () => {
    const { data, isLoading } = useList({
        resource: "rides",
        config: {
            pagination: {
                pageSize: 1000, // Adjust based on your data volume
            },
        },
    });

    const rides = data?.data ?? [];

    const rideData = rides.reduce((acc: any[], ride) => {
        const month = new Date(ride.created_at).toLocaleString("default", {
            month: "short",
        });
        const existing = acc.find((item) => item.timeText === month);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ timeText: month, value: 1, state: "Rides" });
        }
        return acc;
    }, []);


    // Define all months to fill missing ones
    const allMonths = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    // Fill missing months for both Rides and Revenue
    const filledRideData = allMonths.map((month) => {
        const existing = rideData.find(
            (item) => item.timeText === month && item.state === "Rides"
        );
        return existing || { timeText: month, value: 0, state: "Rides" };
    });

    const revenueData = [
        { timeText: "Jan", value: 3, state: "Revenue" },
        { timeText: "Feb", value: 4, state: "Revenue" },
        { timeText: "Mar", value: 5, state: "Revenue" },
        { timeText: "Apr", value: 7, state: "Revenue" },
        { timeText: "May", value: 8, state: "Revenue" },
        { timeText: "Jun", value: 10, state: "Revenue" },
        { timeText: "Jul", value: 90, state: "Revenue" },
        { timeText: "Aug", value: 85, state: "Revenue" },
        { timeText: "Sep", value: 60, state: "Revenue" },
        { timeText: "Oct", value: 70, state: "Revenue" },
        { timeText: "Nov", value: 50, state: "Revenue" },
        { timeText: "Dec", value: 40, state: "Revenue" },
    ];

    const filledRevenueData = allMonths.map((month) => {
        const existing = revenueData.find(
            (item) => item.timeText === month && item.state === "Revenue"
        );
        return existing || { timeText: month, value: 0, state: "Revenue" };
    });

    const combinedData = [...filledRideData, ...filledRevenueData];
    console.log("Final Combined Data:", combinedData);

    const config: AreaConfig = {
        data: combinedData,
        xField: "timeText",
        yField: "value",
        isStack: false,
        seriesField: "state",
        animation: true,
        startOnZero: false,
        smooth: true,
        legend: {
            offsetY: -6,
        },
        yAxis: {
            tickCount: 4,
            label: {
                formatter: (v: string) => {
                    const value = parseFloat(v); 
                    if (!isNaN(value) && value > 1000) { 
                        return `$${value / 1000}k`;
                    }
                    return v;
                },
                
                
            },
        },
        tooltip: {
            formatter: (data) => {
                return {
                    name: data.state,
                    value:
                        data.state === "Revenue"
                            ? `$${Number(data.value) / 1000}k`
                            : `${data.value} Rides`,
                };
            },
        },
    };

    return (
        <Card
            style={{
                height: "100%",
            }}
            headStyle={{
                padding: "8px 16px",
            }}
            bodyStyle={{
                padding: "24px 24px 0 24px",
            }}
            title={
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <DollarOutlined />
                    <Text size="sm" style={{ marginLeft: "0.5rem" }}>
                        Rides and Revenue
                    </Text>
                </div>
            }
        >
            <Area {...config} height={325} loading={isLoading} />
        </Card>
    );
};

export default RideChart;
