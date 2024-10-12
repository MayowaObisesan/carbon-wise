import React, { useEffect, useState } from "react";
import "react-phone-number-input/style.css";
import { CountryDropdown } from "react-country-region-selector";
import {
    useAccount,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";

import { WasteWise } from "../../components/WasteWise";
import Button from "../../components/Button";
// import { WASTEWISE_ABI, WASTEWISE_ADDRESS } from "../utils";
import { useWasteWiseContext } from "../../context";
import { toast } from "sonner";
import SignUpButton from "../../components/SignUpButton";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import { CARBONWISE_ADDRESS, CARBONWISEABI } from "../../../constants";
import useNotificationCount from "../../hooks/useNotificationCount";
import Navbar from "../../components/Navbar";

const CompanyRegister = () => {
    const navigate = useNavigate();
    const { address } = useAccount();
    const [name, setName] = useState("");
    const notificationCount = useNotificationCount();
    const { wastewiseStore, setNotifCount } =
        useWasteWiseContext();
    const { data: hash, writeContract, isError, isPending: isLoading, isSuccess } = useWriteContract()


    const { isLoading: settling, error } = useWaitForTransactionReceipt({
        confirmations: 1,
        hash
    });

    useEffect(() => {
        if (isSuccess) {
            console.log(hash);
            // setCurrentUser(data);
            toast.success("Registration successful", {
                duration: 10000,
                onAutoClose: (t) => {
                    wastewiseStore
                        .setItem(t.id.toString(), {
                            id: t.id,
                            title: t.title,
                            datetime: new Date(),
                            type: t.type,
                        })
                        .then(function (_: any) {
                            setNotifCount(notificationCount);
                        });
                },
            });
            // const redirectTo = "";
            // if (currentUser.role === 1) {}
            setTimeout(() => {
                navigate("/dashboard/carbonmarket");
            }, 1200);
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isError) {
            toast.error(<div>{error?.message}</div>, {
                // onAutoClose: (t) => {
                //   wastewiseStore
                //     .setItem(t.id.toString(), {
                //       id: t.id,
                //       title: t.title,
                //       datetime: new Date(),
                //       type: t.type,
                //     })
                //     .then(function (_: any) {
                //       setNotifCount(notificationCount);
                //     });
                // },
            });
        }
    }, [isError]);

    useEffect(() => {
        if (isLoading) {
            toast.loading("Companying your information. Kindly hold", {
                // description: "My description",
                duration: 15000,
            });
        }
    }, [isLoading]);

    function handleSubmit(e: any) {
        e.preventDefault();
        writeContract({
            address: CARBONWISE_ADDRESS,
            abi: CARBONWISEABI,
            args: [name],
            functionName: "createCompanyAcct",
            account: address
        });
    }

    return (
        <>
            <Navbar />
            <div className="flex h-full px-4 lg:h-9/12">
                <div className="flex flex-col justify-center items-center lg:w-1/2 lg:mx-28 mx-1 lg:pl-8">
                    <h1 className="text-3xl font-black leading-8 mb-8">
                        Register Your Company!
                    </h1>
                    <form
                        className="flex flex-col"
                        action=""
                        id="signup-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-control w-full my-4">
                            <label className="label">
                                <span className="label-text">Company Name</span>
                                {/* <span className="label-text-alt">Top Right label</span> */}
                            </label>
                            <input
                                type="text"
                                name="company name"
                                placeholder="What can we call you"
                                className="input input-bordered w-full"
                                defaultValue={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label className="label">
                                <span className="label-text-alt text-error">
                                    {/* Nickname can only be strings and numbers */}
                                </span>
                                {/* <span className="label-text-alt">Bottom Right label</span> */}
                            </label>
                        </div>

                        {/* Submit button */}
                        <div className="form-control w-full px-4 py-8 mx-auto lg:w-auto">
                            <Button
                                name={isLoading ? "Loading..." : "Sign up"}
                                size="md btn-block lg:btn-wide"
                                disabled={isLoading}
                                onClick={handleSubmit}
                            >
                                {(isLoading || settling) && <span className="loading"></span>}
                            </Button>
                        </div>

                        {isSuccess && (
                            <div>
                                Successfully signed you up!
                                <div>
                                    <a href={`https://sepolia.etherscan.io/tx/${hash}`}>
                                        Confirm your transaction on Etherscan
                                    </a>
                                </div>
                            </div>
                        )}
                        {isError && <div>{error?.message} - Error occurred</div>}
                    </form>
                </div>
                <div className="bg-gradient-to-t from-[#CBE5D8] to-[#FFFFFF] dark:bg-gradient-to-t dark:from-yellow-500/10 dark:to-emerald-500/40 w-1/2 px-16 hidden lg:flex lg:flex-col lg:justify-center dark:bg-transparent">
                    {/* <h1
            className="light:text-[#02582E] text-2xl font-extrabold mb-3
"
          >
            Register an Account
          </h1> */}
                    <div className="w-10/12 text-xl font-normal light:text-[#02582E] leading-[3]">
                        <h1 className="text-2xl">Hello... 👋🏼</h1>
                        <br />
                        Welcome to Carbon-Wise.
                        <br />
                        We'll like to know some of your information to personalize your
                        experience on Carbon-Wise.
                        <br />
                        Join the community that makes saving the planet a rewarding
                        activity.
                        <br />
                        <br />
                        <strong className="text-lg">
                            It'll only take 37 seconds or less. <br /> We promise.
                        </strong>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CompanyRegister;
