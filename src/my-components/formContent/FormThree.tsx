import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "../my-hooks/createClient";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type UserData = {
  avatar: string;
};
type UserFormProps = UserData & {
  updateForm: (fields: Partial<UserData>) => void;
};

export const FormThree = ({ avatar, updateForm }: UserFormProps) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const uploadAvatar = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) {
        throw new Error("User is not logged in.");
      }

      const filePath = `${user.id}/${file.name}`;
      const { data, error } = await supabase.storage
        .from("pfps")
        .upload(filePath, file);

      if (error) {
        throw new Error(error.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("pfps")
        .getPublicUrl(data.path);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Failed to retrieve public URL.");
      }

      return publicUrlData.publicUrl;
    },
    onSuccess: (publicUrl) => {
      updateForm({ avatar: publicUrl });
      toast({
        title: "",
        description: "Your avatar has been successfully uploaded!",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        description: "There was an error while uploading the avatar",
      });
    },
  });

  const handleSubmit = () => {
    if (!file) {
      toast({
        variant: "destructive",
        description: "No avatar selected!",
      });
      return;
    }

    uploadAvatar.mutate(file);
  };

  return (
    <div className="w-2/3">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
      >
        <h2 className="font-bold text-4xl  mt-24">Let’s Get You an Avatar</h2>
        <p className="font-medium   mt-2 opacity-85">
          Your avatar is your digital persona! Pick an image that shows the
          world who you really are—just remember, no pressure! It’s not like
          we’ll judge you for that cat picture... right?
        </p>
      </motion.div>
      <div className=" mt-10 space-y-4 ">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.3 } }}
        >
          <Label htmlFor="avatar" className="text-md font-light">
            Avatar
          </Label>
          <Input
            id="avatar"
            className="mt-1"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          ></Input>
          <Button
            onClick={handleSubmit}
            className="mt-4"
            disabled={uploadAvatar.isSuccess}
          >
            {uploadAvatar.isPending
              ? "Uploading"
              : uploadAvatar.isSuccess
              ? "Avatar Uploaded"
              : "Upload Avatar"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
