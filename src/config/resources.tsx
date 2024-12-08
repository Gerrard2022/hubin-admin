import { CarTwoTone, DashboardOutlined } from "@ant-design/icons";
import { FaUserCog } from "react-icons/fa";
import { VscOrganization } from "react-icons/vsc";

import { IResourceItem } from "@refinedev/core";

export const resources: IResourceItem[] = [
    {
        name: 'dashboard',
        list: "/",
        meta: {
            label: "Dashboard",
            icon: <DashboardOutlined />
        }
    },
    {
        name:'rides',
        list: '/rides',
        show: '/rides/:id',
        meta: {
            label: 'Rides',
            icon: <CarTwoTone />
        }
    },
    {
        name:'drivers',
        list: '/drivers',
        show: '/drivers/:id',
        edit: '/drivers/edit/:id',
        meta: {
            label: 'Drivers',
            icon: <FaUserCog />
        }
    },
    {
        name:'organizations',
        list: '/organizations',
        show: '/organizations/:id',
        create: '/organizations/new',
        edit: '/organization/edit/:id',
        meta: {
            label: 'Organizations',
            icon: <VscOrganization />

        }
    },
]