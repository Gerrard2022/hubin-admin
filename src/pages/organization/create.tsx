import { useModalForm } from "@refinedev/antd";
import { useGo } from "@refinedev/core";
import { Form, Input, Modal } from "antd";
import React from "react";

const CreateOrganization = () => {
  const go = useGo();

  const goToListPage = () => {
    go({
      to: { resource: "organizations", action: "list" },
      type: "replace",
    });
  };

  const { formProps, modalProps } = useModalForm({
    action: "create",
    defaultVisible: true,
    resource: "organizations",
    redirect: false,
    mutationMode: "pessimistic",
    onMutationSuccess: goToListPage,
  });

  return (
    <Modal
      {...modalProps}
      maskClosable={false}
      onCancel={goToListPage}
      title="Create Organization"
      width={512}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Organization Name"
          name="name"
          rules={[{ required: true, message: "Please enter the organization name" }]}
        >
          <Input placeholder="Organization name" />
        </Form.Item>
        <Form.Item
          label="Owner Name"
          name="owner"
          rules={[{ required: true, message: "Please enter the owner's name" }]}
        >
          <Input placeholder="Owner name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrganization;
