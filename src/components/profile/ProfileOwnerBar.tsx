import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProfileOwnerBar = () => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Link to="/dashboard/edit-profile">
        <Button size="sm" className="gap-2 rounded-full shadow-lg">
          <Pencil className="w-4 h-4" />
          Edit Profile
        </Button>
      </Link>
    </div>
  );
};
