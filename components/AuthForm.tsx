"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        // Sign in the user after successful sign-up
        const signInResult = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await signInResult.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Account created successfully!");
        router.push("/");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="w-auto lg:min-w-[566px] bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-cyan-400/20 rounded-2xl shadow-[0_0_40px_#00ffff1a] hover:shadow-[0_0_55px_#00ffff35] transition-all duration-300">
      <div className="flex flex-col gap-6 py-14 px-10 text-white">
        {/* Logo & Branding */}
        <div className="flex flex-row items-center justify-center gap-3">
          <svg width="39" height="34" viewBox="0 0 39 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.4565 4.74223H23.5946C23.9123 4.74223 24.2275 4.75549 24.5393 4.78145C25.2866 4.84325 26.0047 4.48205 26.3786 3.83189C27.0759 2.6196 26.2799 1.08759 24.8861 0.970196C24.46 0.934358 24.0294 0.916016 23.5943 0.916016H15.5121C7.0695 0.916016 -0.0583356 7.8229 0.000359945 16.2655C0.0291433 20.4312 1.73131 24.2001 4.46517 26.9339C7.22273 29.6915 11.0331 31.3959 15.2414 31.3959H23.5943C24.0294 31.3959 24.4603 31.3776 24.8861 31.3417C26.2799 31.2241 27.0756 29.6923 26.3786 28.4801C26.0047 27.8299 25.2866 27.4687 24.5393 27.5305C24.2275 27.5565 23.912 27.5697 23.5943 27.5697H15.2414C8.85379 27.5697 3.6756 22.2976 3.82968 15.8791C3.97924 9.64811 9.2243 4.74223 15.4565 4.74223Z" fill="url(#paint0_linear_7127_2420)"/>
            <path d="M4.40082 24.2363L1.64946 31.2677C1.20699 32.3981 2.38936 33.48 3.47636 32.9396L11.1881 29.1044L4.40082 24.2363Z" fill="#FFC19E"/>
            <path d="M29.875 9.89827C29.3967 9.41798 28.8583 8.99103 28.2753 8.6287C27.8968 8.39279 27.4499 8.32308 27.0153 8.43201C26.5793 8.5415 26.2153 8.81692 25.9901 9.20803C25.8487 9.45664 25.7739 9.73601 25.7739 10.0157C25.7739 10.5891 26.068 11.1159 26.561 11.4246C28.2075 12.4527 29.1904 14.222 29.1904 16.1572C29.1904 18.0917 28.207 19.8607 26.5598 20.889C25.8002 21.3653 25.5507 22.3397 25.9918 23.1082C26.285 23.615 26.831 23.9299 27.4166 23.9299C27.7196 23.9299 28.0159 23.8458 28.2724 23.6864C30.8982 22.0587 32.4655 19.2438 32.4655 16.1572C32.4661 13.7916 31.5458 11.5691 29.875 9.89827Z" fill="#DDDFFF"/>
            <path d="M24.7344 18.4356C23.4753 18.4356 22.4546 17.4149 22.4546 16.1558C22.4546 14.8967 23.4753 13.876 24.7344 13.876C25.9935 13.876 27.0142 14.8967 27.0142 16.1558C27.0142 17.4149 25.9935 18.4356 24.7344 18.4356Z" fill="white"/>
            <path d="M38.833 16.1581C38.833 21.6346 35.947 26.4338 31.6134 29.1205C31.3021 29.3133 30.9584 29.403 30.6184 29.403C29.9538 29.403 29.3054 29.0562 28.9493 28.4399C28.4292 27.5346 28.7407 26.3951 29.6265 25.8398C32.8559 23.8238 35.0067 20.238 35.0067 16.1581C35.0067 12.0782 32.8559 8.48933 29.6265 6.47336C29.0328 6.10087 28.6956 5.46538 28.6956 4.81381C28.6956 4.49606 28.7791 4.17182 28.9493 3.87326C29.4885 2.93583 30.6988 2.62457 31.6168 3.19601C32.6183 3.8188 33.5427 4.5508 34.371 5.38213C37.1282 8.13941 38.833 11.9498 38.833 16.1581Z" fill="url(#paint1_linear_7127_2420)"/>
            <defs>
              <linearGradient id="paint0_linear_7127_2420" x1="25.7203" y1="11.3378" x2="8.2079" y2="27.7861" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#FFC19E"/>
              </linearGradient>
              <linearGradient id="paint1_linear_7127_2420" x1="39.1873" y1="29.8598" x2="30.211" y2="30.4563" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D5D5FF"/>
                <stop offset="0.991615" stopColor="#FFDAC8"/>
              </linearGradient>
            </defs>
          </svg>
          <h2 className="text-2xl font-bold text-cyan-300">Susap</h2>
        </div>
  
        <h3 className="text-center text-lg font-semibold text-white tracking-wide">
          Practice job interviews with AI
        </h3>
  
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}
  
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />
  
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
  
            <Button
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-lg text-sm font-semibold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isSignIn ? "Signing in..." : "Creating account..."}
                </div>
              ) : (
                isSignIn ? "Sign In" : "Create an Account"
              )}
            </Button>
          </form>
        </Form>
  
        {/* Toggle Auth Link */}
        <p className="text-sm text-center text-gray-300">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="ml-2 text-cyan-400 hover:text-cyan-300 font-medium"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
