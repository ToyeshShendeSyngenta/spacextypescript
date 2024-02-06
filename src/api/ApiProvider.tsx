import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface Launch {
  flight_number: number;
  mission_name: string;
  mission_id: string[];
  launch_year: number;
  launch_success: boolean;
  rocket?: {
    first_stage: {
      cores: [{ land_success: boolean }];
    };
  };
  links: {
    mission_patch_small: string;
  };
}

interface ApiContextProps {
  launchData: Launch[];
  filters: {
    launchSuccess: boolean | null;
    landSuccess: boolean | null;
    launchYear: string;
  };
  handleFilterChange: (filterType: string, value: boolean | string) => void;
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [launchData, setLaunchData] = useState<Launch[]>([]);
  const [filters, setFilters] = useState({
    launchSuccess: null,
    landSuccess: null,
    launchYear: "",
  });

  useEffect(() => {
    const apiUrl = `https://api.spaceXdata.com/v3/launches?limit=100${getFilterParams()}`;

    axios
      .get(apiUrl)
      .then((response) => setLaunchData(response.data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, [filters]);

  const getFilterParams = () => {
    const { launchSuccess, landSuccess, launchYear } = filters;
    let params = "";

    if (launchSuccess !== null) {
      params += `&launch_success=${launchSuccess}`;
    }

    if (landSuccess !== null) {
      params += `&land_success=${landSuccess}`;
    }

    if (launchYear !== "") {
      params += `&launch_year=${launchYear}`;
    }

    return params;
  };

  const handleFilterChange = (filterType: string, value: boolean | string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const apiContextValue: ApiContextProps = {
    launchData,
    filters,
    handleFilterChange,
  };

  return (
    <ApiContext.Provider value={apiContextValue}>{children}</ApiContext.Provider>
  );
};

export const useApi = (): ApiContextProps => {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }

  return context;
};
