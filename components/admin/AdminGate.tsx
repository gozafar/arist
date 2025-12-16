"use client";

import { ReactNode } from "react";

// Currently left open by default. If you need to re-enable gating, add your auth check here.
const AdminGate = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default AdminGate;
