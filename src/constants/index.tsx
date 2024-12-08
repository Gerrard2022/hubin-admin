import { AuditOutlined, ShopOutlined, TeamOutlined, DollarOutlined } from "@ant-design/icons";

const IconWrapper = ({
  color,
  children,
}: React.PropsWithChildren<{ color: string }>) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        backgroundColor: color,
      }}
    >
      {children}
    </div>
  );
};

export type TotalCountType = "organizations" | "users" | "rides" | "revenue";

export const totalCountVariants: {
  [key in TotalCountType]: {
    primaryColor: string;
    secondaryColor?: string;
    icon: React.ReactNode;
    title: string;
    data: { index: string; value: number }[];
  };
} = {
  organizations: {
    primaryColor: "#1677FF",
    secondaryColor: "#BAE0FF",
    icon: (
      <IconWrapper color="#E6F4FF">
        <ShopOutlined
          className="md"
          style={{
            color: "#1677FF",
          }}
        />
      </IconWrapper>
    ),
    title: "Number of Organizations",
    data: [
      { index: "1", value: 150 },
      { index: "2", value: 180 },
      { index: "3", value: 130 },
      { index: "4", value: 220 },
      { index: "5", value: 190 },
    ],
  },
  users: {
    primaryColor: "#52C41A",
    secondaryColor: "#D9F7BE",
    icon: (
      <IconWrapper color="#F6FFED">
        <TeamOutlined
          className="md"
          style={{
            color: "#52C41A",
          }}
        />
      </IconWrapper>
    ),
    title: "Number of Users",
    data: [
      { index: "1", value: 10000 },
      { index: "2", value: 11500 },
      { index: "3", value: 10700 },
      { index: "4", value: 13500 },
      { index: "5", value: 12900 },
    ],
  },
  rides: {
    primaryColor: "#FA541C",
    secondaryColor: "#FFD8BF",
    icon: (
      <IconWrapper color="#FFF2E8">
        <AuditOutlined
          className="md"
          style={{
            color: "#FA541C",
          }}
        />
      </IconWrapper>
    ),
    title: "Total Rides",
    data: [
      { index: "1", value: 5000 },
      { index: "2", value: 5400 },
      { index: "3", value: 4800 },
      { index: "4", value: 6200 },
      { index: "5", value: 5900 },
    ],
  },
  revenue: {
    primaryColor: "#FFC107",
    secondaryColor: "#FFECB3",
    icon: (
      <IconWrapper color="#FFF8E1">
        <DollarOutlined
          className="md"
          style={{
            color: "#FFC107",
          }}
        />
      </IconWrapper>
    ),
    title: "Total Revenue",
    data: [
      { index: "1", value: 100000 },
      { index: "2", value: 94000 },
      { index: "3", value: 108000 },
      { index: "4", value: 115000 },
      { index: "5", value: 120000 },
    ],
  },
};

export const statusOptions: {
  label: string;
  value: string;
}[] = [
  { label: "New", value: "NEW" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
];

export const companySizeOptions: {
  label: string;
  value: string;
}[] = [
  { label: "Small", value: "SMALL" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Large", value: "LARGE" },
  { label: "Enterprise", value: "ENTERPRISE" },
];

export const industryOptions: {
  label: string;
  value: string;
}[] = [
  { label: "Ride-hailing", value: "RIDE_HAILING" },
  { label: "Affiliate Marketing", value: "AFFILIATE_MARKETING" },
  { label: "Logistics", value: "LOGISTICS" },
  { label: "Travel", value: "TRAVEL" },
  { label: "Hospitality", value: "HOSPITALITY" },
  { label: "Other", value: "OTHER" },
];
