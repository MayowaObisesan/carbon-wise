import { useEffect, useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import CARBONWISE_ABI from "../../../constants/carbonwise.json";
import { toast } from "sonner";
import { CARBONWISE_ADDRESS } from "../../../constants";

type Props = {};

const CreateAdmin = (props: Props) => {
  const [address, setAddress] = useState<string>();

  const [loading, setLoading] = useState<boolean>(false);

  const [role, setRole] = useState<string>();
  const navigate = useNavigate();

  const { data: hash, writeContract, isError, isPending: isLoading, isSuccess } = useWriteContract()
  const { data: hash2, writeContract: writeContract2, isError: isError2, isPending: isLoading2, isSuccess: isSuccess2 } = useWriteContract()

  const { isLoading: isAddingVerifier, isSuccess: isVerifierSuccess } =
    useWaitForTransactionReceipt({
      hash: hash2,
      // onSettled(data, error) {
      //   if (data?.blockHash) {
      //     console.log("he don enter");
      //     navigate("/dashboard");
      //   }
      // },
    });

  const { isLoading: isAddingAdmin, isSuccess: isAdminSuccess } =
    useWaitForTransactionReceipt({
      hash,
      // onSettled(data, error) {
      //   if (data?.blockHash) {
      //     navigate("/dashboard");
      //   }
      // },
    });

  useEffect(() => {
    if (isAdminSuccess) {
      navigate("/dashboard");
    }
    if (isVerifierSuccess) {
      navigate("/dashboard");
    }
  }, [isAdminSuccess, isVerifierSuccess]);

  const handleAddAdmin = async () => {
    writeContract({
      address: CARBONWISE_ADDRESS,
      abi: CARBONWISE_ABI,
      functionName: "addAdmins",
      args: [address],
      // onError(data: any) {
      //   console.log(data);
      // },
    });
    setLoading(true);
    console.log(true);
  };
  const handleAddVerifier = async () => {
    console.log("clicking");
    writeContract2({
      address: CARBONWISE_ADDRESS,
      abi: CARBONWISE_ABI,
      functionName: "addVerifiers",
      args: [address],
      // onError(data: any) {
      //   console.log(data);
      // },
    });
    setLoading(true);
    console.log(true);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (role == "addAdmin") {
      handleAddAdmin();
    }
    if (role == "addVerifier") {
      handleAddVerifier();
    }
  };

  useEffect(() => {
    if (isVerifierSuccess) {
      toast.success("Successfully Created Verifier", {
        // description: "My description",
        duration: 5000,
      });
    }
  }, [isVerifierSuccess]);

  useEffect(() => {
    if (isAdminSuccess) {
      toast.success("Successfully Created Admin", {
        // description: "My description",
        duration: 5000,
      });
    }
  }, [isAdminSuccess]);

  // useEffect(() => {
  //   if (loadingA) {
  //     toast.loading("Creating Admin...", {
  //       // description: "My description",
  //       duration: 5000,
  //     });
  //   }
  // }, [loadingA]);

  // useEffect(() => {
  //   if (loadingV) {
  //     toast.loading("Creating Verifier", {
  //       // description: "My description",
  //       duration: 5000,
  //     });
  //   }
  // }, [loadingV]);
  // useEffect(() => {
  //   write?.();
  //   if (loading) {
  //     setLoading(true);
  //   }
  // }, [address]);

  // useEffect(() => {
  //   write?.();
  // }, [address]);

  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   setLoading(true);
  // };

  // const { write, isLoading, data } = useContractWrite({
  //   address: WasteWise_ADDRESS,
  //   abi: WASTEWISE_ABI,
  //   functionName: "addAdmins",
  //   args: [address],
  //   onError() {
  //     setLoading(false);
  //   },
  // });

  // useWaitForTransaction({
  //   hash: data?.hash,
  //   onSettled(data, error) {
  //     if (data?.blockHash) {
  //       setLoading(false);
  //       navigate("/dashboard/marketplace");
  //     }
  //   },
  // });

  // useEffect(() => {
  //   write?.();
  // }, [address]);

  useEffect(() => { }, [role]);

  return (
    <div className="mb-8 ">
      <div className="card w-[95%] mx-auto bg-base-100 shadow-xl lg:shadow-2xl pt-4">
        <h3 className="uppercase text-xl text-center font-bold">
          Add Admin/Verifier
        </h3>
        <div className="card-body bg mx-auto">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type address here"
              className="input input-bordered w-full "
              onChange={(e) => setAddress(e.target.value)}
            />
            <select
              title="Select Role"
              className="select select-bordered w-full my-8"
              // onChange={(e) => console.log(e.target)}
              onChange={(e) => setRole(e.target.value)}
            >
              <option disabled value="">
                Submit to Add Admin / Verifier
              </option>

              <option className="py-4" value="addAdmin">
                {/* {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Add Admin"
                )} */}
                Add Admin
              </option>

              <option className="py-4" value="addVerifier">
                {/* {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Add Verifier"
                )} */}
                Add Verifier
              </option>
            </select>
            <Button name="submit" size="block" customStyle="w-full">
              {/* {(loadingA || loadingV || isAddingVerifier || isAddingAdmin) && (
                <span className="loading"></span>
              )} */}
              {(isAddingVerifier || isAddingAdmin) && (
                <span className="loading"></span>
              )}
            </Button>
            {/* <button
              className="btn btn-primary block m-auto w-full"
              type="submit"
            >
              submit
            </button> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;
