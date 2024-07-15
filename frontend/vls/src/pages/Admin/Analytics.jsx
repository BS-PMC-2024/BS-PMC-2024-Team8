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

  const openSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

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
  }, []);

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

        const sortedMonthlyMoney = Object.entries(monthlyMoney)
          .map(([monthYear, totalMoney]) => ({ monthYear, totalMoney }))
          .sort((a, b) => {
            const [monthA, yearA] = a.monthYear.split('/').map(Number);
            const [monthB, yearB] = b.monthYear.split('/').map(Number);
            return yearA !== yearB ? yearA - yearB : monthA - monthB;
          });

        setMonthlyMoneyCollected(sortedMonthlyMoney);

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

        console.log('sortedMonthlyMoney:', sortedMonthlyMoney);
        console.log('sortedMonthlyProccess:', sortedMonthlyProccess);
        console.log('topActive:', sortedCompanies);
        console.log('sectorData:', sectorData);
      } catch (error) {
        console.error('Error fetching processes:', error);
      }
    };
    fetchProcesses();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:6500/alltransactions');
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
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6347', '#7CFC00', '#FFD700'];

  return (
    <div className='grid-container'>
      <Header openSidebar={openSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} openSidebar={openSidebar} />
      <main className='main-container'>
        <div className='charts'>
          <div>
            <h3 style={{ textAlign: 'center' }}>Top Active Companies</h3>
            <ResponsiveContainer width='100%' height={400}>
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
                <XAxis dataKey='name' scale='point' padding={{ left: 10, right: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray='3 3' />
                <Bar dataKey='count' fill='#fff445' background={{ fill: '#eee' }} />
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
                <Bar dataKey='count' fill='#EE4E4E' background={{ fill: '#eee' }} />
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
                  background
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
            <h3 style={{ textAlign: 'center' }}>Top Communication Apps</h3>
            <ResponsiveContainer width='100%' height={400}>
              <BarChart
                width={500}
                height={300}
                data={bestVia}
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
                <Bar dataKey='value' fill='#795458' background={{ fill: '#eee' }} />
              </BarChart>
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
                <Bar dataKey='value' fill='#E178C5' background={{ fill: '#eee' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
