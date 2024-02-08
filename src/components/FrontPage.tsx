import "./FrontPage.css";
import React, { useState } from "react";
import { Button, Input } from "antd";
import { useApi } from "../api/ApiProvider";
import styled from 'styled-components';

const CustomButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

interface Launch {
  flight_number: number;
  mission_name: string;
  mission_id: string;  
  launch_year: string;  
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

const FrontPage: React.FC = () => {
  const { launchData, filters, handleFilterChange } = useApi();

  const [search, setSearch] = useState<string>("");
  console.log(search);

  const renderYearTags = () => {
    const years = [
      "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014",
      "2015", "2016", "2017", "2018", "2019", "2020"
    ];

    return years.map((year, index) => (
      <CustomButton
        key={`${year}-${index}`}
        className={filters.launchYear === year ? "active-tag" : "tag"}
        onClick={() => handleFilterChange("launchYear", year)}
      >
        {year}
      </CustomButton>
    ));
  };

  return (
    <div data-testid="front-page">
      <h2>SpaceX Launch Programs</h2>
      <div className="main">
        <div className="filters">
          <h4>Filters</h4>
          <div className="filter-section">
            <div className="filter-subsection">
              <h4>Name Search</h4>
              <Input
                data-testid='inputtest'
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
              ></Input>
            </div>
            <div className="filter-subsection">
              <h4>Launch Year</h4>
              <div className="tags">{renderYearTags()}</div>
            </div>
            <div className="filter-subsection1">
              <h4>Successful Launch</h4>
              <CustomButton
                data-testid="launchbuttont"
                className={filters.launchSuccess ? "active" : ""}
                onClick={() => handleFilterChange("launchSuccess", true)}
              >
                True
              </CustomButton>
              <CustomButton
              data-testid="launchbuttonf"
                className={filters.launchSuccess === false ? "active" : ""}
                onClick={() => handleFilterChange("launchSuccess", false)}
              >
                False
              </CustomButton>
            </div>
            <div className="filter-subsection1">
              <h4>Successful Landing</h4>
              <CustomButton
                data-testid="landbuttont"
                className={filters.landSuccess ? "active" : ""}
                onClick={() => handleFilterChange("landSuccess", true)}
              >
              True
              </CustomButton>
              <CustomButton
              data-testid="landbuttonf"
                className={filters.landSuccess === false ? "active" : ""}
                onClick={() => handleFilterChange("landSuccess", false)}
              >
                False
              </CustomButton>
            </div>
          </div>
        </div>
        <div className="cards" data-testid="cards-container">
          {launchData
            .filter(
              (launch: Launch) =>
                !search ||
                launch.mission_name
                  .toLowerCase()
                  .includes(search.toLowerCase())
            )
            .map((launch: Launch) => (
              <div key={`${launch.flight_number}-${launch.launch_year}`} data-testid="cardtest" className="card">
                <img
                  src={launch.links.mission_patch_small}
                  alt={launch.mission_name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images2.imgbox.com/6f/c0/D3Owbmpo_o.png";
                  }}
                />
                <h3 className="heading">{`${launch.mission_name} #${launch.flight_number}`}</h3>
                <p>
                  <b>Mission IDs: </b> {launch.mission_id}
                </p>
                <p>
                  <b>Launch Year: </b> {launch.launch_year}
                </p>
                <p>
                  <b>Launch Success: </b>
                  {launch.launch_success ? "True" : "False"}
                </p>
                <p>
                  <b>Successful Landing : </b>
                  {launch.rocket?.first_stage?.cores[0]?.land_success ? "True" : "False"}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
