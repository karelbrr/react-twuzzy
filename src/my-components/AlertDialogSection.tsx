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

interface Props {
  onConfirm: () => void;  
  title: string;
  desc: string;
}

const AlertDialogSection = ({ onConfirm, title, desc }: Props) => {
  return (
    <div className="w-full">
      <AlertDialog>
        <AlertDialogTrigger className="w-full flex justify-center" asChild>
          <Button className="w-[20%] m-0">
            Update
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{desc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            
            <AlertDialogAction onClick={()=>onConfirm()} >Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AlertDialogSection;
