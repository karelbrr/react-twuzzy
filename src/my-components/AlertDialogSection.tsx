import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  onConfirm: () => void;
  title: string;
  desc: string;
  isPending: boolean;
}

const AlertDialogSection = ({ onConfirm, title, desc, isPending }: Props) => {
  return (
    <div className="w-full">
      <AlertDialog>
        <AlertDialogTrigger className="w-full flex justify-center" asChild>
          <Button className="w-[20%] m-0">
            {isPending ? <Loader2 className="animate-spin" /> : "Update"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{desc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction onClick={() => onConfirm()}>
              Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AlertDialogSection;
