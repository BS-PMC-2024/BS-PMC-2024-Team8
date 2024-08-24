import React, { useEffect, useState } from "react";
import Header from "./componants/Header";
import {
  BsPeopleFill,
  BsCheckCircle,
  BsArrowRepeat,
  BsCash,
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import "./stylesAdmin.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Sidebar from "./componants/sideBar";

function Home() {
  const navigate = useNavigate();
  const [Usersnumber, setUsersnumber] = useState(0);
  const [ProcessesnumberO, setProcessesnumberO] = useState(0);
  const [ProcessesnumberC, setProcessesnumberC] = useState(0);
  const [MoneyCollected, setMoneyCollected] = useState(0);
  const [topActive, setTopActive] = useState([]);
  const [monthlyMoneyCollected, setMonthlyMoneyCollected] = useState([]);
  useEffect(() => {
    const checkAdminPermission = async () => {
      const email = Cookies.get("email");

      if (!email) {
        navigate("/", { replace: true });
        return;
      }
      try {
        const response = await axios.post(
          "http://localhost:6500/check-permission",
          { email }
        );

        if (!response.data.data.premission == "admin") {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error checking admin permission:", error);
        navigate("/", { replace: true });
      }
    };
    checkAdminPermission();
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:6500/allusers");
        setUsersnumber(response.data.users.length);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await axios.get("http://localhost:6500/allprocesses");
        const processes = response.data.processes;
        let openedProcesses = 0;
        let completedProcesses = 0;
        let moneyCollected = 0;
        const companyCount = {};
        const monthlyMoney = {};

        processes.forEach((process) => {
          if (process.status === "opened") {
            openedProcesses++;
          } else {
            completedProcesses++;
            moneyCollected += parseInt(process.moneyC, 10);
          }

          if (companyCount[process.cname]) {
            companyCount[process.cname]++;
          } else {
            companyCount[process.cname] = 1;
          }

          const [day, month, year] = process.date.split("/");
          const monthYear = `${month}/${year}`;
          if (!monthlyMoney[monthYear]) {
            monthlyMoney[monthYear] = 0;
          }
          monthlyMoney[monthYear] += parseInt(process.moneyC, 10);
        });

        setProcessesnumberO(openedProcesses);
        setProcessesnumberC(completedProcesses);
        setMoneyCollected(moneyCollected);

        const sortedCompanies = Object.entries(companyCount)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setTopActive(sortedCompanies);

        const sortedMonthlyMoney = Object.entries(monthlyMoney)
          .map(([monthYear, totalMoney]) => ({ monthYear, totalMoney }))
          .sort((a, b) => {
            const [monthA, yearA] = a.monthYear.split("/").map(Number);
            const [monthB, yearB] = b.monthYear.split("/").map(Number);
            return yearA !== yearB ? yearA - yearB : monthA - monthB;
          });

        setMonthlyMoneyCollected(sortedMonthlyMoney);
      } catch (error) {
        console.error("Error fetching processes:", error);
      }
    };
    fetchProcesses();
  }, []);

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <main className="main-container">
        <div className="main-title">
          <h3>DASHBOARD</h3>
        </div>

        <div className="main-cards">
          <div className="card">
            <div className="card-inner">
              <h3>PROCESS OPENED</h3>
              <BsArrowRepeat className="card_icon" />
            </div>
            <h1>{ProcessesnumberO}</h1>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>PROCESS COMPLETED</h3>
              <BsCheckCircle className="card_icon" />
            </div>
            <h1>{ProcessesnumberC}</h1>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>CUSTOMERS</h3>
              <BsPeopleFill className="card_icon" />
            </div>
            <h1>{Usersnumber}</h1>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>MONEY COLLECTED</h3>
              <BsCash className="card_icon" />
            </div>
            <h1>{MoneyCollected}</h1>
          </div>
        </div>

        <div className="charts">
          <div>
            <h3 style={{ textAlign: "center" }}>Top Active Companies</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                width={500}
                height={300}
                data={topActive}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                barSize={20}
              >
                <XAxis
                  dataKey="name"
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar
                  dataKey="count"
                  fill="#8884d8"
                  background={{  fill: "transparent" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 style={{ textAlign: "center" }}>Monthly Money Collected</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                width={500}
                height={300}
                data={monthlyMoneyCollected}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthYear" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalMoney"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
