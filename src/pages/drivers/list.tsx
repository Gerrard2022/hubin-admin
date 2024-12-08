import { List } from "@refinedev/antd";
import { Table, Space, Tag } from "antd";
import { EditButton, DeleteButton } from "@refinedev/antd";
import { useList } from "@refinedev/core";

const Drivers = () => {
    const { data, isLoading } = useList({
        resource: "driver",
        meta: {
            select: "*", 
        },
    });

    return (
        <List breadcrumb={false}>
            <div>
                <Table
                    dataSource={data?.data}
                    loading={isLoading}
                    pagination={{ pageSize: 12 }}
                    rowKey="id"
                    scroll={{ x: "max-content" }}
                    style={{ whiteSpace: "nowrap" }}
                >
                    <Table.Column dataIndex="legalname" title="Legal Name" />
                    <Table.Column dataIndex="email" title="Email" />
                    <Table.Column dataIndex="phonenumber" title="Phone Number" />
                    <Table.Column dataIndex="plate" title="Plate Number" />
                    <Table.Column dataIndex="vehicle" title="Vehicle" />
                    <Table.Column dataIndex="seats" title="Seats" />
                    <Table.Column dataIndex="price" title="Price" />
                    <Table.Column
                        dataIndex="is_active"
                        title="Status"
                        render={(value) =>
                            value ? (
                                <Tag color="green">Active</Tag>
                            ) : (
                                <Tag color="red">Inactive</Tag>
                            )
                        }
                    />
                    <Table.Column
                        title="Approval Status"
                        render={(record) =>
                            record.approved ? (
                                <Tag color="green">Approved</Tag>
                            ) : (
                                <Tag color="red">Not Approved</Tag>
                            )
                        }
                    />
                    <Table.Column
                        title="Profile Picture"
                        render={(record) => (
                            <img
                                src={record.profile_picture}
                                alt="Profile"
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                }}
                            />
                        )}
                    />
                    <Table.Column
                        title="Driving Permit"
                        render={(record) => (
                            <img
                                src={record.drivingpermit}
                                alt="Driving Permit"
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "5px",
                                }}
                            />
                        )}
                    />
                    <Table.Column
                        title="National ID"
                        render={(record) => (
                            <img
                                src={record.nationalid}
                                alt="National ID"
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "5px",
                                }}
                            />
                        )}
                    />
                    <Table.Column
                        title="Actions"
                        fixed="right"
                        render={(record) => (
                            <Space>
                                <EditButton hideText size="small" recordItemId={record.id} />
                                <DeleteButton hideText size="small" recordItemId={record.id} />
                            </Space>
                        )}
                    />
                </Table>
            </div>
        </List>
    );
};

export default Drivers;
