import { Col, Row } from "antd";
import { DasboardTotalCountCard, RecentRides, RideChart } from "../../components";
import { useList } from "@refinedev/core";

export const Home = () => {
    // Fetch rides data and count using useList
    const { data: rideData, isLoading: isLoadingRides } = useList({
        resource: "rides",
    });

    const { data: userData, isLoading: isLoadingUsers } = useList({
        resource: "user",
    });

    const totalRides = rideData?.total ?? 0; // Fallback to 0 if no data
    const totalUsers = userData?.total ?? 0; // Fallback to 0 if no data

    return (
        <div>
            <Row gutter={[32, 32]}>
                <Col xs={24} sm={24} xl={8}>
                    <DasboardTotalCountCard
                        resource="revenue"
                        isLoading={false} // Set to true if fetching revenue data
                        totalCount={500} // Replace with actual revenue count
                    />
                </Col>
                <Col xs={24} sm={24} xl={8}>
                    <DasboardTotalCountCard
                        resource="users"
                        isLoading={isLoadingUsers}
                        totalCount={totalUsers} // Display total user count
                    />
                </Col>
                <Col xs={24} sm={24} xl={8}>
                    <DasboardTotalCountCard
                        resource="rides"
                        isLoading={isLoadingRides}
                        totalCount={totalRides} 
                    />
                </Col>
            </Row>
            <Row
                gutter={[32, 32]}
                style={{
                    marginTop: "32px",
                }}
            >
                <Col
                    xs={24}
                    sm={24}
                    xl={6}
                    style={{
                        height: "460px",
                    }}
                >
                    <RecentRides />
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    xl={18}
                    style={{
                        height: "460px",
                    }}
                >
                    <RideChart />
                </Col>
            </Row>
        </div>
    );
};

export default Home;
