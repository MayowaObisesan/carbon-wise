import { useEffect, useRef, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { useNavigate, useParams } from "react-router-dom";
import { formatEther, formatUnits, parseEther } from "viem";
import { formatDate } from "../../utils";
import { FaMinus, FaPlus } from "react-icons/fa";
import {
  CC_MARKETPLACE_ADDRESS,
  CCMARKETPLACEABI,
  EVENT_MARKETPLACE_ADDRESS,
  EVENTMARKETPLACEABI,
  USD_TOKEN_ADDRESS,
  USDTOKENABI,
} from "../../../constants";
import { toast } from "sonner";

interface datap {
  price: number,
  description: string
}

const SingleCarbon = () => {
  let { id } = useParams();
  const [listing, setListing] = useState<any>();
  const { address } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingA, setLoadingA] = useState<boolean>(false);
  const [disablePay, setDisablePay] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(1);
  const [total, settotal] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [allowance, setAllowance] = useState<number>(0);
  const [allowanceAmount, setAllowanceAmount] = useState<number>(0);
  const allowanceAmountRef = useRef(0);
  const [allowanceListener, setallowanceListener] = useState(null);

  const navigate = useNavigate();

  const { data: hash, writeContract, isError: isError1, isPending: isLoading1, isSuccess: isSuccess1 } = useWriteContract()
  const { data: hash2, writeContract: writeContract2, isError: isError2, isPending: isLoading2, isSuccess: isSuccess2 } = useWriteContract()

  const { isLoading, data, isSuccess } = useReadContract({
    address: CC_MARKETPLACE_ADDRESS,
    abi: CCMARKETPLACEABI,
    functionName: "getItemInfo",
    args: [id],
    // onError(data: any) {
    //     console.log(data);
    // },
  });



  const { data: allowanceData, isLoading: loading1, isSuccess: isSuccess3 } = useReadContract({
    address: USD_TOKEN_ADDRESS,
    abi: USDTOKENABI,
    functionName: "allowance",
    args: [address, CC_MARKETPLACE_ADDRESS],
    // onError(data: any) {
    //     console.log(data);
    // },
    // onSuccess(data: any) {
    //     setAllowance(data);
    // },
  });

  useEffect(() => {
    if (isSuccess) {
      setListing(data);
      setLoading(false);
      settotal(amount * Number((data as datap).price));
    }
    if (isSuccess3) {
      setAllowance(allowanceData as any);
    }
  }, [isSuccess, isSuccess3])

  useWatchContractEvent({
    address: USD_TOKEN_ADDRESS,
    abi: USDTOKENABI,
    eventName: "Approval",
    onLogs(log: any) {
      setallowanceListener(log);
    },
  });

  const handleDisable = () => {
    let dateNow = Math.floor(Date.now() / 1000);
    if (listing?.deadline < dateNow) {
      return true;
    } else {
      return false;
    }
  };

  const { isLoading: settling1, isSuccess: success } = useWaitForTransactionReceipt({
    hash: hash2,
    // onSettled(data, error) {
    //     if (data?.blockHash) {
    //         toast.success("Approval successful");
    //         console.log("he don approve");
    //         setLoadingA(false);
    //         // navigate()
    //         // write?.();
    //     }
    // },
  });
  const { isLoading: settling2, isSuccess: success2 } = useWaitForTransactionReceipt({
    hash,
    // onSettled(data, error) {
    //     if (data?.blockHash) {
    //         console.log("he don pay");
    //         toast.success("Item successfully purchased");
    //         setLoading(false);
    //         navigate("/dashboard/myEvents");
    //     }
    // },
  });

  useEffect(() => {
    if (settling1) {
      toast.loading("Approving Contract", {
        // description: "My description",
        duration: 10000,
      });
    }
    if (success) {
      toast.success("Approval successful");
      console.log("he don approve");
      setLoadingA(false);
    }
  }, [settling1, success]);

  useEffect(() => {
    if (settling2) {
      toast.loading("Purchasing", {
        // description: "My description",
        duration: 10000,
      });
    }
    if (success2) {
      console.log("he don pay");
      toast.success("Item successfully purchased");
      setLoading(false);
      navigate("/dashboard/purchases");
    }
  }, [settling2, success2]);

  const handleApprove = (e: any) => {
    e.preventDefault();
    // const value = allowanceAmountRef.current?.value;
    // setAllowanceAmount(value);
    setLoadingA(true);
    writeContract2({
      address: USD_TOKEN_ADDRESS,
      abi: USDTOKENABI,
      functionName: "approve",
      args: [CC_MARKETPLACE_ADDRESS, parseEther(`${total}`)],
      // onError(data: any) {
      //     console.log(data);
      //     toast.error("Approval failed");
      //     setLoadingA(false);
      // },
    });
  };
  const handlePay = async () => {
    setLoading(true);
    console.log(true);
    // write2?.();
    writeContract({
      address: CC_MARKETPLACE_ADDRESS,
      abi: CCMARKETPLACEABI,
      functionName: "buyListing",
      args: [listing?.itemId],
      // onError(data: any) {
      //     console.log(data);
      //     // toast.error("!Failed to purchase item");
      //     setLoading(false);
      // },
    });
  };

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    }
  }, []);

  // useEffect(() => {
  //     if (isErrorA) {
  //         setLoadingA(false);
  //     }
  // }, [isErrorA]);
  // useEffect(() => {
  //     if (isErrorP) {
  //         setLoading(false);
  //     }
  // }, [isErrorP]);
  useEffect(() => {
    window.localStorage.setItem("itemAmount", `${amount}`);
  }, [amount]);
  useEffect(() => { }, [allowanceAmount]);
  useEffect(() => { }, [allowanceListener]);
  console.log(allowance);


  return (
    <div className="mb-8">
      <div className="flex justify-between items-start gap-x-8">
        <div className="card mb-5 w-[95%] max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto bg-base-100 shadow-xl lg:shadow-2xl pt-4">
          <div className="card-body">
            <h2 className="card-title">
              {listing?.name}
              <div className="badge badge-secondary">NEW</div>
            </h2>
            <p>{listing?.description}</p>
            <div className="card-actions justify-between items-center mt-5">
              <h3 className="font-bold text-lg">
                {listing ? Number(listing?.price) : ""}{" "}
                <span>USDT</span>
              </h3>
            </div>
            <button
              className="btn bg-[#026937] hover:bg-[#026937]"
              onClick={
                allowance < parseEther(`${total}`)
                  ? () =>
                    (
                      document.getElementById(
                        "my_modal_2"
                      ) as HTMLDialogElement
                    )?.showModal()
                  : handlePay
              }
              disabled={handleDisable()}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : handleDisable() ? (
                "Expired"
              ) : (
                "Pay Now"
              )}
            </button>
          </div>
        </div>

        <div>
          <div className="mb-5 stats hidden lg:block stats-vertical w-full shadow-xl lg:shadow-2xl">
            <div className="stat">
              <div className="stat-figure text-success-content dark:text-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </div>
              <div className="stat-value text-success-content dark:text-success">
                645
              </div>
              <div className="stat-title">Items sold</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-8 h-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <div className="stat-title">Transactions</div>
              <div className="stat-value text-secondary">2.6M</div>
            </div>
          </div>

          <section className="p-2 lg:p-8 hidden lg:block shadow-xl lg:shadow-2xl">
            <div className="font-bold text-2xl">Transactions</div>
            <div className="overflow-x-auto my-4">
              <table className="table table-xs lg:table-md">
                {/* head */}
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Tokens</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  <tr className="h-16">
                    <th>7-Nov-2023</th>
                    <td>0xB5119738BB5Fe8BE39aB592539EaA66F03A77174</td>
                    <td>40</td>
                  </tr>
                  <tr className="h-16">
                    <th>18-Jun-2023</th>
                    <td>0xB5119738BB5Fe8BE39aB592539EaA66F03A77174</td>
                    <td>12</td>
                  </tr>
                  <tr className="h-16">
                    <th>14-Mar-2023</th>
                    <td>0xB5119738BB5Fe8BE39aB592539EaA66F03A77174</td>
                    <td>4</td>
                  </tr>
                  <tr className="h-16">
                    <th>9-Feb-2023</th>
                    <td>0xB5119738BB5Fe8BE39aB592539EaA66F03A77174</td>
                    <td>11</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Set Approval</h3>
          <p className="py-4">
            {/* Your approval should be more than{" "} */}
            Clicking "Approve" will set an allowance of{" "}
            <span className="font-bold">{total} USDT</span>.
          </p>
          <form onSubmit={handleApprove}>
            {/* <input
              type="number"
              placeholder="Enter Allowance"
              className="input input-bordered w-full mb-4"
              ref={allowanceAmountRef}
            /> */}
            <button
              className="btn bg-[#026937] hover:bg-[#026937] w-full"
              type="submit"
            >
              {loadingA ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Approve"
              )}
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default SingleCarbon;
