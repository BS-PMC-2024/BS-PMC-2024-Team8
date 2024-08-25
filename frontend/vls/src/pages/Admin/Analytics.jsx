import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Treemap,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import './stylesAdmin.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Sidebar from './componants/sideBar';
import Header from './componants/Header';

const Analytics = () => {
  const navigate = useNavigate();
  const [usersNumber, setUsersNumber] = useState(0);
  const [topActive, setTopActive] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [monthlyProccessCollected, setMonthlyProccessCollected] = useState([]);
  const [monthlyMoneyCollected, setMonthlyMoneyCollected] = useState([]);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [cities, setCities] = useState([]);
  const [ages, setAges] = useState([]);
  const [bestVia, setBestVia] = useState([]);
  const [bestDiscount, setBestDiscount] = useState([]);

  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const openSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
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

        if (response.data.data.premission !== "admin") {
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
        const response = await axios.get('http://localhost:6500/allusers');
        setUsersNumber(response.data.users.length);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [refreshTrigger]);

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await axios.get('http://localhost:6500/allprocesses');
        const processes = response.data.processes;
        let openedProcesses = 0;
        let completedProcesses = 0;
        let moneyCollected = 0;
        const companyCount = {};
        const monthlyMoney = {};
        const sectorCount = {};
        const monthlyProccess = {};

        processes.forEach((process) => {
          if (process.status === 'opened') {
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

          // Count processes in each sector
          if (process.sector) {
            if (sectorCount[process.sector]) {
              sectorCount[process.sector]++;
            } else {
              sectorCount[process.sector] = 1;
            }
          }

          // Parsing the date and accumulating money per month
          const [day, month, year] = process.date.split('/');
          const monthYear = `${month}/${year}`;
          if (!monthlyMoney[monthYear]) {
            monthlyMoney[monthYear] = 0;
          }
          monthlyMoney[monthYear] += parseInt(process.moneyC, 10);

          // Count processes opened per month
          if (!monthlyProccess[monthYear]) {
            monthlyProccess[monthYear] = 0;
          }
          monthlyProccess[monthYear]++;
        });

        const sortedCompanies = Object.entries(companyCount)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setTopActive(sortedCompanies);
        
        const sectorData = Object.entries(sectorCount).map(([name, value]) => ({
          name,
          value,
        }));

        setSectors(sectorData);

        const sortedMonthlyProccess = Object.entries(monthlyProccess)
          .map(([monthYear, count]) => ({ monthYear, count }))
          .sort((a, b) => {
            const [monthA, yearA] = a.monthYear.split('/').map(Number);
            const [monthB, yearB] = b.monthYear.split('/').map(Number);
            return yearA !== yearB ? yearA - yearB : monthA - monthB;
          });

        setMonthlyProccessCollected(sortedMonthlyProccess);

        console.log('sortedMonthlyProccess:', sortedMonthlyProccess);
        console.log('topActive:', sortedCompanies);
        console.log('sectorData:', sectorData);
      } catch (error) {
        console.error('Error fetching processes:', error);
      }
    };
    fetchProcesses();
  }, [refreshTrigger]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:6500/alltransactions');
        console.log('Transactions Response:', response.data); // Add this line
        const transactions = response.data.transactions;
        
        const cityCount = {};
        const ageCount = {};
        const viaCount = {};
        const discountCount = {};
  
        transactions.forEach((transaction) => {
          // Count transactions in each city
          if (transaction.city) {
            if (cityCount[transaction.city]) {
              cityCount[transaction.city]++;
            } else {
              cityCount[transaction.city] = 1;
            }
          }
  
          // Count ages of each transaction
          if (transaction.age) {
            if (ageCount[transaction.age]) {
              ageCount[transaction.age]++;
            } else {
              ageCount[transaction.age] = 1;
            }
          }
  
          // Count transactions by via
          if (transaction.via) {
            if (viaCount[transaction.via]) {
              viaCount[transaction.via]++;
            } else {
              viaCount[transaction.via] = 1;
            }
          }
  
          // Count transactions by discount
          if (transaction.discount) {
            if (discountCount[transaction.discount]) {
              discountCount[transaction.discount]++;
            } else {
              discountCount[transaction.discount] = 1;
            }
          }
        });
  
        const cityData = Object.entries(cityCount).map(([name, value]) => ({
          name,
          value,
        }));
  
        setCities(cityData);
  
        const ageData = Object.entries(ageCount).map(([name, value]) => ({
          name,
          value,
        }));
  
        setAges(ageData);
  
        const viaData = Object.entries(viaCount).map(([name, value]) => ({
          name,
          value,
        }));
  
        setBestVia(viaData);
  
        const discountData = Object.entries(discountCount).map(([name, value]) => ({
          name,
          value,
        }));
  
        setBestDiscount(discountData);
  
        console.log('cityData:', cityData);
        console.log('ageData:', ageData);
        console.log('viaData:', viaData);
        console.log('discountData:', discountData);
  
        // Group transactions by month/year and sum the debt
        const monthlyMoneyMap = transactions.reduce((acc, transaction) => {
          const [day, month, year] = transaction.date.split('/').map(Number);
          const monthYear = `${month}/${year}`;
          const debtAmount = parseFloat(transaction.debt); // Ensure debt is a number
  
          if (!acc[monthYear]) {
            acc[monthYear] = 0;
          }
  
          acc[monthYear] += debtAmount;
  
          return acc;
        }, {});
  
        const sortedMonthlyMoney = Object.entries(monthlyMoneyMap)
          .map(([monthYear, totalMoney]) => ({ monthYear, totalMoney }))
          .sort((a, b) => {
            const [monthA, yearA] = a.monthYear.split('/').map(Number);
            const [monthB, yearB] = b.monthYear.split('/').map(Number);
            return yearA !== yearB ? yearA - yearB : monthA - monthB;
          });

        setMonthlyMoneyCollected(sortedMonthlyMoney);
  
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    
    fetchTransactions();
  }, [refreshTrigger]);
  

  useEffect(() => {
    // Set up interval for periodic data fetching
    const intervalId = setInterval(() => {
      setRefreshTrigger(prev => !prev); // Toggle state to trigger useEffect
      console.log(refreshTrigger);
    }, 60000); // 60,000 ms = 1 minute

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6347', '#7CFC00', '#FFD700'];

  return (
    <div className='grid-container'>
      <Header openSidebar={openSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} openSidebar={openSidebar} />
      <main className='main-container'>
      <h3 style={{fontSize:'21px'}}>Analytics</h3>
        <div className='charts'>
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
              <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="count" fill="#fff445"  background={{ fill: "transparent" }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

          <div>
            <h3 style={{ textAlign: 'center' }}>Monthly Money Collected</h3>
            <ResponsiveContainer width='100%' height={400}>
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
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='monthYear' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='totalMoney' stroke='#8884d8' activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 style={{ textAlign: 'center' }}>Sectors of Clients</h3>
            <ResponsiveContainer width='100%' height={400}>
              <PieChart width={100}>
                <Pie
                  data={sectors}
                  cx='50%'
                  cy='50%'
                  outerRadius={150}
                  fill='#8884d8'
                  dataKey='value'
                  label
                >
                  {sectors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 style={{ textAlign: 'center' }}>Monthly Proccess Opened</h3>
            <ResponsiveContainer width='100%' height={400}>
              <BarChart
                width={500}
                height={300}
                data={monthlyProccessCollected}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                barSize={20}
              >
                <XAxis dataKey='monthYear' scale='point' padding={{ left: 10, right: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray='3 3' />
                <Bar dataKey='count' fill='#EE4E4E' background={{  fill: "transparent" }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 style={{ textAlign: 'center' }}>Top Cities</h3>
            <ResponsiveContainer width='100%' height={400}>
              <Treemap
                width={500}
                height={300}
                data={cities}
                dataKey='value'
                stroke='#fff'
                testid='citiesCheck'
              >
                {cities.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <Tooltip />
              </Treemap>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 style={{ textAlign: 'center' }}>Ages of the Payers</h3>
            <ResponsiveContainer width='100%' height={400}>
              <RadialBarChart
                width={500}
                height={300}
                innerRadius='10%'
                outerRadius='120%'
                data={ages}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  minAngle={15}
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background ={{ fill: "transparent"}}
                  clockWise
                  dataKey='value'

                >
                  {ages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </RadialBar>
                <Legend />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div>
          <h3 style={{ textAlign: 'center' }}>Communication Apps</h3>
            <ResponsiveContainer width='100%' height={400}>
              <PieChart>
                <Pie
                  data={bestVia}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  outerRadius='80%'
                  fill='#8884d8'
                  label
                >
                  {bestVia.map((entry, index) => {
                    // Determine color based on the name of the communication app
                    const { name } = entry;
                    let fillColor;
                    
                    if (name.toLowerCase() === 'email') {
                      fillColor = '#FF6F61'; // Red/Orange color
                    } else if (name.toLowerCase() === 'whatsapp') {
                      fillColor = '#25D366'; // WhatsApp green color
                    } else {
                      fillColor = COLORS[index % COLORS.length]; // Fallback color
                    }

                    return <Cell key={`cell-${index}`} fill={fillColor} />;
                  })}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 style={{ textAlign: 'center' }}>Top Discount Plans</h3>
            <ResponsiveContainer width='100%' height={400}>
              <BarChart
                width={500}
                height={300}
                data={bestDiscount}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                barSize={20}
              >
                <XAxis dataKey='name' scale='point' padding={{ left: 10, right: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray='3 3' />
                <Bar dataKey='value' fill='#E178C5' background={{  fill: "transparent" }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
