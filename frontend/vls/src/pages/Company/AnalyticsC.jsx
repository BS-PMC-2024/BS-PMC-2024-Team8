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
import '../Admin/stylesAdmin.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Admin/componants/sideBar';
import Header from '../Admin/componants/Header';

const Analytics = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [topActive, setTopActive] = useState([]);
  const [monthlyProccessCollected, setMonthlyProccessCollected] = useState([]);
  const [monthlyMoneyCollected, setMonthlyMoneyCollected] = useState([]);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [cities, setCities] = useState([]);
  const [ages, setAges] = useState([]);
  const [bestVia, setBestVia] = useState([]);
  const [bestDiscount, setBestDiscount] = useState([]);
  const [debtGroups, setDebtGroups] = useState({}); 

  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const openSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  function getCookie(val) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === val) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const company = getCookie("company"); 
        const response = await axios.get(`http://localhost:6500/clients/${company}`);
        const users = response.data.clients;
        console.log("from fetch users");
        console.log(users);
        users.sort((a, b) => a.Debt - b.Debt);
        const groups = {};
        users.forEach(user => {
          const debtRange = Math.floor(user.Debt / 1000) * 1000;
          if (!groups[debtRange]) {
            groups[debtRange] = 0;
          }
          groups[debtRange]++;
        });
        setDebtGroups(groups);
        let maxCount = 0;
        let topActiveGroup = null;
        Object.entries(groups).forEach(([debtRange, count]) => {
          if (count > maxCount) {
            maxCount = count;
            topActiveGroup = { debtRange, count };
          }
        });

        if (topActiveGroup) {
          console.log('Top active group:', topActiveGroup);
          setTopActive(topActiveGroup);
        }
        setUsers(users);
        
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [refreshTrigger]);

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const company = getCookie("company");
        const response = await axios.get(`http://localhost:6500/allprocesses/${company}`); // || ""
        const processes = response.data.filteredProcesses;
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

        const sortedMonthlyMoney = Object.entries(monthlyMoney)
          .map(([monthYear, totalMoney]) => ({ monthYear, totalMoney }))
          .sort((a, b) => {
            const [monthA, yearA] = a.monthYear.split('/').map(Number);
            const [monthB, yearB] = b.monthYear.split('/').map(Number);
            return yearA !== yearB ? yearA - yearB : monthA - monthB;
          });

        setMonthlyMoneyCollected(sortedMonthlyMoney);

        const sortedMonthlyProccess = Object.entries(monthlyProccess)
          .map(([monthYear, count]) => ({ monthYear, count }))
          .sort((a, b) => {
            const [monthA, yearA] = a.monthYear.split('/').map(Number);
            const [monthB, yearB] = b.monthYear.split('/').map(Number);
            return yearA !== yearB ? yearA - yearB : monthA - monthB;
          });

        setMonthlyProccessCollected(sortedMonthlyProccess);

      } catch (error) {
        console.error('Error fetching processes:', error);
      }
    };
    fetchProcesses();
  }, [refreshTrigger]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const company = getCookie("company");
        const response = await axios.get(`http://localhost:6500/transactions/${company}`);
        const transactions = response.data.transactions;
        console.log(transactions);
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
      <h1 style={{fontSize:'22px',marginLeft:'10px'}}>Analytics </h1>

        <div className='charts'>
          <div> 
            <h3 style={{ textAlign: 'center' }}>Top Debt clients</h3> 
            <ResponsiveContainer width='100%' height={400}>
              <BarChart
                data={Object.entries(debtGroups).map(([debtRange, count]) => ({
                  name: debtRange.toString(), // Assuming you want to show debt ranges as strings
                  count: count
                }))}
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
                <Bar dataKey='count' fill='#8884d8'  background={{  fill: "transparent" }}/>
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
                  background={{  fill: "transparent" }}
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
