import { CalendarOutlined } from "@ant-design/icons";
import { Badge, Card, List } from "antd";
import { useList } from "@refinedev/core";
import { Text } from "../text";
import RecentRidesSkeleton from "../skeleton/recent-rides";

export const RecentRides = () => {
    // Fetch recent rides data using useList
    const { data, isLoading } = useList({
        resource: "rides",
        config: {
            pagination: {
                pageSize: 5, // Fetch the latest 5 rides
                current: 1,
            },
            sort: [
                {
                    field: "created_at",
                    order: "desc",
                },
            ],
        },
    });

    const rides = data?.data ?? []; // Extract ride data or fallback to an empty array

    return (
        <Card
            style={{
                height: "100%",
            }}
            headStyle={{
                padding: "8px 16px",
            }}
            bodyStyle={{
                padding: "0 1rem",
            }}
            title={
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <CalendarOutlined />
                    <Text size="sm" style={{ marginLeft: "0.7rem" }}>
                        Recent Rides
                    </Text>
                </div>
            }
        >
            {isLoading ? (
                <List
                    itemLayout="horizontal"
                    dataSource={Array.from({ length: 5 }).map((_, index) => ({
                        id: index,
                    }))}
                    renderItem={() => <RecentRidesSkeleton />}
                />
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={rides}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Badge color="blue" />} // Default badge color
                                title={<Text size="xs">{item.ride_time}</Text>}
                                description={
                                    <Text ellipsis={{ tooltip: true }} strong>
                                        {item.origin_address} → {item.destination_address}
                                    </Text>
                                }
                            />
                        </List.Item>
                    )}
                />
            )}
            {!isLoading && rides.length === 0 && (
                <span
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "220px",
                    }}
                >
                    No Rides
                </span>
            )}
        </Card>
    );
};

export default RecentRides;
