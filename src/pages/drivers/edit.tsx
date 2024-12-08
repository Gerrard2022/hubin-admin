import { Edit } from "@refinedev/antd";
import { useList, useUpdate, useNavigation } from "@refinedev/core";
import { Col, Form, Row, Button, Image, Typography } from "antd";
import { useParams } from "react-router-dom";

const EditDriver = () => {
  const { id } = useParams();
  const { data, isLoading: listLoading, refetch } = useList({
    resource: "driver",
    config: {
      filters: [{ field: "id", operator: "eq", value: id }],
    },
  });

  const driverData = data?.data?.[0];
  const { mutate, isLoading: updateLoading } = useUpdate();
  const { push } = useNavigation();

  const toggleApproval = () => {
    if (!driverData) return;

    mutate(
      {
        resource: "driver",
        id: driverData.id,
        values: { approved: !driverData.approved },
      },
      {
        onSuccess: () => {
          refetch();
          push("/drivers");
        },
      }
    );
  };

  if (listLoading) {
    return <div>Loading driver data...</div>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Row gutter={[32, 32]} justify="center" align="middle" style={{ width: "100%" }}>
        <Col xs={24} xl={12}>
          <Edit isLoading={listLoading || updateLoading} breadcrumb={false}>
            <Typography.Title level={4}>Edit Driver</Typography.Title>
            <Form layout="vertical">
              <Form.Item label="National ID">
                {driverData?.nationalid ? (
                  <Image
                    src={driverData.nationalid}
                    alt="National ID"
                    style={{ maxWidth: "100%" }}
                  />
                ) : (
                  "No National ID Available"
                )}
              </Form.Item>
              <Form.Item label="Driving License">
                {driverData?.drivingpermit ? (
                  <Image
                    src={driverData.drivingpermit}
                    alt="Driving License"
                    style={{ maxWidth: "100%" }}
                  />
                ) : (
                  "No Driving License Available"
                )}
              </Form.Item>
              <Form.Item label="Profile Picture">
                {driverData?.profile_picture ? (
                  <Image
                    src={driverData.profile_picture}
                    alt="Profile Picture"
                    style={{
                      maxWidth: "100%",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  "No Profile Picture Available"
                )}
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  danger={driverData?.approved}
                  loading={updateLoading}
                  onClick={toggleApproval}
                >
                  {driverData?.approved ? "Disapprove" : "Approve"}
                </Button>
              </Form.Item>
            </Form>
          </Edit>
        </Col>
      </Row>
    </div>
  );
};

export default EditDriver;
