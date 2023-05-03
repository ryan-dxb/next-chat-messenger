import { authOptions } from "@/lib/auth";
import { NextPage } from "next";
import { getServerSession } from "next-auth";

interface DashboardProps {}

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  return <pre>{JSON.stringify(session, null, 2)}</pre>;
};

export default Dashboard;
