import React from "react";
import AdminLayout from "../hoc/adminLayout";
import "./dashboard.css";
import { FormattedMessage } from "react-intl";
const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="dashboard_main">
        <h1>
          <FormattedMessage
            id="admin.dashboard"
            defaultMessage="This is your dashboard"
          />
        </h1>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
