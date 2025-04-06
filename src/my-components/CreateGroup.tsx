import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  group_name: string;
  description: string;
  avatar_url: string;
  is_public: boolean;
};

export const CreateGroup = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      is_public: false,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <section>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"outline"} className=" mr-2 w-full">
            <Users /> Create Group
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Start a conversation by creating a group and adding people.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full max-w-full items-center gap-1.5">
              <Label htmlFor="name">Group Name</Label>
              <Input
                type="text"
                id="name"
                placeholder={
                  errors.group_name
                    ? "This field is required"
                    : "Group Name"
                }
                {...register("group_name", { required: true })}
                className={`${errors.group_name && "border-red-700 placeholder:text-red-700"}`}
              />
            </div>
            <div className="grid w-full max-w-full items-center gap-1.5">
              <Label htmlFor="desc">Description</Label>
              <Input
                type="text"
                id="desc"
               
                placeholder={
                    errors.description
                      ? "This field is required"
                      : "Group Name"
                  }
                {...register("description", { required: true })}
                className={`${errors.description && "border-red-700 placeholder:text-red-700"}`}

              />
            </div>
            <div className="grid w-full max-w-full items-center gap-1.5">
              <Label htmlFor="avatar">Avatar</Label>
              <Input type="file" id="avatar" accept=".png, .jpg, .jpeg" />
            </div>
            <div className="grid w-full max-w-full items-center gap-1.5">
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                defaultValue="private"
                value={watch("is_public") ? "public" : "private"}
                onValueChange={(value) =>
                  setValue("is_public", value === "public")
                }
              >
                <SelectTrigger className="max-w-full">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Options</SelectLabel>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Create</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
