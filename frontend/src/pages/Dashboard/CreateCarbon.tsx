import { useEffect, useState } from "react";
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useNavigate } from "react-router-dom";
import {
  CC_MARKETPLACE_ADDRESS,
  CCMARKETPLACEABI,
} from "../../../constants";
import { pinFileToIPFS } from "../../utils";
import { toast } from "sonner";
import { parseEther } from "viem";

type Props = {};

const CreateCarbon = (props: Props) => {
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { writeContract, data: createEventData, isError, isPending } = useWriteContract();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    writeContract({
      address: CC_MARKETPLACE_ADDRESS,
      abi: CCMARKETPLACEABI,
      functionName: "createListing",
      args: [description, price],
      // onError() {
      //   toast.error("!Failed to create an event.");
      //   setLoading(false);
      // },
    });
  };



  useEffect(() => {
    if (isError) {
      toast.error("!Failed to create an event.");
      setLoading(false);
    }
  }, [isError]);

  const { isSuccess, isLoading } = useWaitForTransactionReceipt({
    hash: createEventData,
    // onSettled(data, error) {
    //   if (data?.blockHash) {
    //     toast.success("Event successfully created");
    //     setLoading(false);
    //     navigate("/dashboard/marketplace");
    //   }
    // },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Carbon credit successfully created");
      setLoading(false);
      navigate("/dashboard/carbonmarket");
    }
    if (isLoading) {
      toast.info("Carbon credit creating");
    }
    if (isPending) {
      toast.loading("Carbon credit creating", {
        // description: "My description",
        duration: 5000,
      });
    }

  }, [isLoading, isSuccess, isPending]);

  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="card w-[95%] mx-auto bg-base-100 shadow-xl lg:shadow-2xl pt-4">
        <h3 className="uppercase text-xl text-center font-bold">
          Sell Carbon Credit
        </h3>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="md:grid gap-x-5 sm:justify-center">
              <div className="form-control mb-3 w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto">
                <label className="label">
                  <span className="label-text">Credit Amount (1 per usdt) </span>
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="input input-bordered w-full"
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
              <div className="form-control mb-3 w-full max-w-xs sm:max-w-md md:max-w-xl mx-auto">
                <label className="label">
                  <span className="label-text">Credit Description</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  className="input input-bordered w-full"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="card-actions">
              <button className="btn w-full max-w-xs sm:max-w-md mx-auto md:max-w-2xl text-white bg-[#026937] hover:bg-[#026937]">
                {isPending ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "submit"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCarbon;
