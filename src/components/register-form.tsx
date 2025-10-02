"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { UploadThingError } from "uploadthing/server";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { collegeOptions, roleOptions } from "~/lib/constants";
import Link from "next/link";
import { api } from "~/trpc/react";
import { uploadFiles } from "~/utils/uploadthing";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "~/components/ui/file-upload";

const formSchema = z
  .object({
    lastName: z.string().min(1, "Last name is required"),
    middleName: z.string(),
    firstName: z.string().min(1, "First name is required"),
    role: z.string().min(1, "Role is required"),
    idNumber: z.string().min(1, "ID number is required"),
    college: z.string().min(1, "College is required"),
    email: z
      .string()
      .email("Invalid email address")
      .regex(
        /^[\w.-]+@(isatu\.edu\.ph|students\.isatu\.edu\.ph)$/,
        "Email must end with @isatu.edu.ph or @students.isatu.edu.ph",
      ),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    image: z.instanceof(File).optional().or(z.string().optional()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );

  // tRPC mutation
  const registerMutation = api.auth.register.useMutation({
    onSuccess: () => {
      toast.success("Account created successfully!");
      setIsSubmitting(false);
      router.push("/"); // Redirect to login page
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong!");
      setIsSubmitting(false);
    },
  });

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: "",
      middleName: "",
      firstName: "",
      role: "",
      idNumber: "",
      college: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: undefined,
    },
  });

  // Handle file upload during form submission
  const uploadFilesDuringSubmit = async (files: File[]) => {
    if (files.length === 0) return [];

    try {
      const res = await uploadFiles("imageUploader", {
        files,
        onUploadProgress: ({ file, progress }) => {
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: progress,
          }));
        },
      });

      return res;
    } catch (error) {
      if (error instanceof UploadThingError) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const errorMessage =
          error.data && "error" in error.data
            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              error.data.error
            : "Upload failed";
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        throw new Error(errorMessage);
      }
      throw error;
    }
  };

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      let uploadedFiles: Awaited<ReturnType<typeof uploadFiles>> = [];

      // Upload files if any are selected
      if (files.length > 0) {
        toast.info("Uploading image...");
        uploadedFiles = await uploadFilesDuringSubmit(files);
        toast.success("Image uploaded successfully!");
      }

      // Prepare form data with uploaded file URLs
      const formData = {
        ...values,
        image: uploadedFiles.length > 0 ? uploadedFiles[0]?.url : undefined,
      };

      // Submit registration
      await registerMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
      setIsSubmitting(false);
    }
  }

  // Handle file rejection
  const onFileReject = React.useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  // Handle file removal
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    form.setValue("image", undefined);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="grid grid-cols-1 gap-2">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Let&apos;s get started. Fill in the details below to create your
            account.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="idNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roleOptions.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="college"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select college" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {collegeOptions.map((college) => (
                        <SelectItem key={college.value} value={college.value}>
                          {college.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Integrated File Upload Component */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <FileUpload
                  accept="image/*"
                  maxFiles={1}
                  maxSize={8 * 1024 * 1024}
                  className="w-full max-w-md xl:max-w-xl"
                  onAccept={(acceptedFiles) => {
                    setFiles(acceptedFiles);
                    field.onChange(acceptedFiles[0]);
                  }}
                  onFileReject={onFileReject}
                  multiple={false}
                  disabled={isSubmitting}
                >
                  <FileUploadDropzone>
                    <div className="flex flex-col items-center gap-1 text-center">
                      <Upload className="text-muted-foreground h-8 w-8" />
                      <p className="text-sm font-medium">
                        Drag & drop image here
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Or click to browse (max 1 file, up to 8MB)
                      </p>
                    </div>
                    <FileUploadTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-fit"
                        type="button"
                      >
                        Browse files
                      </Button>
                    </FileUploadTrigger>
                  </FileUploadDropzone>
                  <FileUploadList>
                    {files.map((file, index) => (
                      <FileUploadItem key={index} value={file}>
                        <div className="flex w-full items-center gap-2">
                          <FileUploadItemPreview />
                          <FileUploadItemMetadata />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => removeFile(index)}
                            type="button"
                            disabled={isSubmitting}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {isSubmitting &&
                          uploadProgress[file.name] !== undefined && (
                            <div className="h-2 w-full rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                                style={{
                                  width: `${uploadProgress[file.name]}%`,
                                }}
                              />
                            </div>
                          )}
                      </FileUploadItem>
                    ))}
                  </FileUploadList>
                </FileUpload>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Register"}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
