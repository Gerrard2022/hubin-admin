import { List } from "@refinedev/antd";
import { Table, Space, Tag } from "antd";
import { EditButton, DeleteButton } from "@refinedev/antd";
import { useList } from "@refinedev/core";

const OrganizationList = () => {
    const { data, isLoading } = useList({
        resource: "organizations",
        meta: {
            select: "*", 
        },
    });

    console.log("organization data here", data);
    

    return (
        <List breadcrumb={false}>
            <Table
                dataSource={data?.data}
                loading={isLoading}
                pagination={{ pageSize: 12 }}
                rowKey="id" // Assuming `id` is the unique identifier
            >
                <Table.Column
                    dataIndex="name"
                    title="Organization Name"
                />
                <Table.Column
                    dataIndex="owner"
                    title="Owner"
                />
                <Table.Column
                    dataIndex="total_revenue"
                    title="Total Revenue"
                    render={(value) => (
                        <Tag color="blue">{`$${value.toLocaleString()}`}</Tag>
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
        </List>
    );
};

export default OrganizationList;
