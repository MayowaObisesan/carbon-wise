import localforage from "localforage";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useDarkMode from "use-dark-mode";
import { type DarkMode } from "use-dark-mode";
import { useAccount, useReadContract } from "wagmi";
import { CARBONWISE_ADDRESS, CARBONWISEABI } from "../../constants";

type contextType = {
  wastewiseStore: any;
  darkMode: DarkMode;
  isRegistered: boolean;
  currentUser: any;
  setCurrentUser: any;
  statistics: any;
  setStatistics: any;
  notifCount: number | any;
  setNotifCount: number | any;
  notifications: any;
  setNotifications: any;
  adminsData: any;
  isAdminsDataFetching: boolean;
  isAdminsDataStale: boolean;
  isAdminsDataSuccessful: boolean;
  allUsersData: any;
  isAllUsersDataFetching: boolean;
  isAllUsersDataStale: boolean;
  isAllUsersDataSuccessful: boolean;
  verifiersData: any;
  isVerifiersDataFetching: boolean;
  isVerifiersDataStale: boolean;
  isVerifiersDataSuccessful: boolean;
};

type userDataType = {
  approvalCount: number;
  country: string;
  email: string;
  gender: number;
  id: number;
  isAdmin: boolean;
  name: string;
  phoneNo: number;
  referral: string;
  role: number;
  timeJoined: number;
  tokenQty: number;
  userAddr: string;
};

const WastewiseContext = createContext<contextType>({
  wastewiseStore: null,
  darkMode: {
    value: false,
    enable: () => {},
    disable: () => {},
    toggle: () => {},
  },
  isRegistered: false,
  currentUser: null,
  setCurrentUser: null,
  statistics: null,
  setStatistics: null,
  notifCount: 0,
  setNotifCount: 0,
  notifications: null,
  setNotifications: null,
  adminsData: null,
  isAdminsDataFetching: false,
  isAdminsDataStale: false,
  isAdminsDataSuccessful: false,
  allUsersData: null,
  isAllUsersDataFetching: false,
  isAllUsersDataStale: false,
  isAllUsersDataSuccessful: false,
  verifiersData: null,
  isVerifiersDataFetching: false,
  isVerifiersDataStale: false,
  isVerifiersDataSuccessful: false,
});

const WastewiseProvider = ({ children }: { children: ReactNode }) => {
  localforage.config({
    driver: [
      localforage.INDEXEDDB,
      localforage.WEBSQL,
      localforage.LOCALSTORAGE,
    ],
    name: "Wastewise-App",
  });
  let wastewiseStore = localforage.createInstance({
    name: "wastewiseStore",
  });

  const { address, isConnected } = useAccount();
  const darkMode = useDarkMode(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<userDataType | {}>({});
  const [notifCount, setNotifCount] = useState(0);
  const [notifications, setNotifications] = useState<any>([]);
  const [statistics, setStatistics] = useState<any>({});

  //   useEffect(() => {
  // }, [wastewiseStore.length()]);
  wastewiseStore
    .length()
    .then(function (nKeys) {
      //   console.log(nKeys);
      setNotifCount(nKeys);
    })
    .catch(function (err) {
      console.log("Error fetching store length: ", err);
    });

  const fetchNotifications = useCallback(() => {
    wastewiseStore
      .iterate(function (value, key, iterNumber) {
        if (notifCount >= notifications.length) {
          // Notification has been deleted, remove it not add it.
          // setNotifications(notifications.filter((item) => item.id !== 'John'))
          console.log(value);
          setNotifications([...notifications, value]);
        }
        return value;
      })
      .then(function (result) {
        console.log(result);
      })
      .catch(function (err) {
        // If there are errors when setting alerts
        console.log(err);
      });
  }, [notifCount]);

  useEffect(() => {
    fetchNotifications();
  }, [notifCount]);

  const { data } = useReadContract({
    address: CARBONWISE_ADDRESS,
    abi: CARBONWISEABI,
    functionName: "getUser",
    // args: [address],
    account: address,
    // onSuccess(data) {
    //   setIsRegistered(data ? Number((data as any)?.userAddr) !== 0 : false);
    // },
  });

  console.log(data);

  const statisticsRead = useReadContract({
    address: CARBONWISE_ADDRESS,
    abi: CARBONWISEABI,
    functionName: "getStatistics",
    account: address,
    // onSuccess(data) {
    //   setStatistics(data as any);
    // },
  });

  const {
    data: adminsData,
    isStale: isAdminsDataStale,
    isStale: isAdminsDataFetching,
    isSuccess: isAdminsDataSuccessful,
  } = useReadContract({
    address: CARBONWISE_ADDRESS,
    abi: CARBONWISEABI,
    functionName: "getAdmins",
    account: address,
  });

  const {
    data: allUsersData,
    isStale: isAllUsersDataStale,
    isStale: isAllUsersDataFetching,
    isSuccess: isAllUsersDataSuccessful,
  } = useReadContract({
    address: CARBONWISE_ADDRESS,
    abi: CARBONWISEABI,
    functionName: "getAllUsers",
    account: address,
  });

  const {
    data: verifiersData,
    isSuccess: isVerifiersDataSuccessful,
    isStale: isVerifiersDataStale,
    isFetching: isVerifiersDataFetching,
  } = useReadContract({
    address: CARBONWISE_ADDRESS,
    abi: CARBONWISEABI,
    functionName: "getVerifiers",
    account: address,
  });

  useEffect(() => {
    setIsRegistered(data ? Number((data as any)?.userAddr) !== 0 : false);
    setCurrentUser(data as any);
    return () => {};
  }, [data, isRegistered]);

  useEffect(() => {
    setStatistics(statisticsRead.data);
  }, [statisticsRead.data, statisticsRead.isSuccess]);

  return (
    <WastewiseContext.Provider
      value={{
        wastewiseStore,
        darkMode,
        isRegistered,
        currentUser,
        setCurrentUser,
        statistics,
        setStatistics,
        notifCount,
        setNotifCount,
        notifications,
        setNotifications,
        adminsData,
        isAdminsDataFetching,
        isAdminsDataStale,
        isAdminsDataSuccessful,
        allUsersData,
        isAllUsersDataFetching,
        isAllUsersDataStale,
        isAllUsersDataSuccessful,
        verifiersData,
        isVerifiersDataFetching,
        isVerifiersDataStale,
        isVerifiersDataSuccessful,
      }}
    >
      {children}
    </WastewiseContext.Provider>
  );
};

export const useWasteWiseContext = () => useContext(WastewiseContext);
export default WastewiseProvider;
