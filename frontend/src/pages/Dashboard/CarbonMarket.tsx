import React, { useEffect, useState } from "react";
import { useReadContract, useWatchContractEvent } from "wagmi";
import { formatUnits } from "viem";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import { formatDate } from "../../utils";
import {
    CC_MARKETPLACE_ADDRESS,
    CCMARKETPLACEABI,
} from "../../../constants";

type Props = {};

const CarbonMarketplace = (props: Props) => {
    const [listings, setListings] = useState<any[]>([]);

    const { isLoading, isError
        , isSuccess, data
    } = useReadContract({
        address: CC_MARKETPLACE_ADDRESS,
        abi: CCMARKETPLACEABI,
        functionName: "getAllItemInfo",
    });
    useWatchContractEvent({
        address: CC_MARKETPLACE_ADDRESS,
        abi: CCMARKETPLACEABI,
        eventName: "ListingCreated",
        onLogs(log) {
            console.log(log);
        },
    });

    useEffect(() => {
        if (isError) {
            console.log('Error')
        }
        if (isSuccess) {
            setListings(data as any);
        }
    }, [isError, isSuccess])
    return (
        <div className="my-8">
            {!isLoading && listings.length == 0 && (
                <p className="text-lg font-semibold text-center">
                    No Items Available To Purchase
                </p>
            )}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {isLoading ? (
                    <span className="loading loading-spinner loading-lg"></span>
                ) : (
                    listings.map((item, index) => {
                        return (
                            <Link to={`event/${item?.itemId}`} key={index}>
                                <div className="card w-80 sm:w-[28rem] md:w-80 bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <h2 className="card-title">
                                            {item?.description}
                                            <div className="badge badge-secondary">NEW</div>
                                        </h2>
                                        <div className="card-actions justify-between items-center mt-3">
                                            <p className="text-lg text-[#026937]">Available</p>
                                            <h3 className="font-bold text-lg">
                                                {Number(item?.price)} <span>USDT</span>
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CarbonMarketplace;
