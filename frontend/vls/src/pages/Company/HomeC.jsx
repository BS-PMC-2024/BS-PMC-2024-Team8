import React , {useEffect, useState} from 'react'
import Header from '../Admin/componants/Header'
import { BsPeopleFill,BsCheckCircle,BsArrowRepeat,BsCash} from 'react-icons/bs'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import '../Admin/stylesAdmin.css'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import Sidebar from '../Admin/componants/sideBar'

function HomeC() {
  const navigate = useNavigate();
  const [ProcessesnumberO, setProcessesnumberO] = useState(0);
  const [ProcessesnumberC, setProcessesnumberC] = useState(0);
  const [MoneyCollected, setMoneyCollected] = useState(0);
  const [bestDiscount, setBestDiscount] = useState([]);
  const [monthlyMoneyCollected, setMonthlyMoneyCollected] = useState([]);
  const [ClientNumber, setClientNumber] = useState(0);
  useEffect(() => {
    const checkCompanyPermission = async () => {
      const email = Cookies.get('email');

      if (!email) {
        navigate('/', { replace: true });
        return;
      }
      try {
        const response = await axios.post('http://localhost:6500/check-permission', { email });
        if (!response.data.premission == "company") {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error checking admin permission:', error);
        navigate('/', { replace: true });
      }
    };
    checkCompanyPermission();
  }, [navigate]);

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const company = Cookies.get('company');
        const response = await axios.get(`http://localhost:6500/allprocesses/${company}`);
        const processes = response.data.filteredProcesses;
        let openedProcesses = 0;
        let completedProcesses = 0;
        let moneyCollected = 0;
        const monthlyMoney = {};
        processes.forEach((process) => {
          if (process.status === 'opened') {
            openedProcesses++;
            moneyCollected += parseInt(process.moneyC, 10);
          } else {
            completedProcesses++;
            moneyCollected += parseInt(process.moneyC, 10);
          }
          const [day, month, year] = process.date.split('/');
          const monthYear = `${month}/${year}`;
          if (!monthlyMoney[monthYear]) {
            monthlyMoney[monthYear] = 0;
          }
          monthlyMoney[monthYear] += parseInt(process.moneyC, 10);
        });

        setProcessesnumberO(openedProcesses);
        setProcessesnumberC(completedProcesses);
        setMoneyCollected(moneyCollected);

        const sortedMonthlyMoney = Object.entries(monthlyMoney)
          .map(([monthYear, totalMoney]) => ({ monthYear, totalMoney }))
          .sort((a, b) => {
            const [monthA, yearA] = a.monthYear.split('/').map(Number);
            const [monthB, yearB] = b.monthYear.split('/').map(Number);
            return yearA !== yearB ? yearA - yearB : monthA - monthB;
          });

        setMonthlyMoneyCollected(sortedMonthlyMoney);

      } catch (error) {
        console.error('Error fetching processes:', error);
      }
    };
    fetchProcesses();
  }, []);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const company = Cookies.get('company');
        console.log(company);
        const response = await axios.get(`http://localhost:6500/transactions/${company}`);
        const transactions = response.data.transactions;
        const discountCount = {};
        transactions.forEach((transaction) => {
          // Count transactions by discount
          if (transaction.discount) {
            if (discountCount[transaction.discount]) {
              discountCount[transaction.discount]++;
            } else {
              discountCount[transaction.discount] = 1;
            }
          }
        });

        const discountData = Object.entries(discountCount).map(([name, plans]) => ({
          name,
          plans,
        }));
        setBestDiscount(discountData);

      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, []);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const company = Cookies.get('company');
        const response = await axios.get(`http://localhost:6500/clients/${company}`);
        const clients = response.data.clients;
        setClientNumber(clients.length);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    fetchClients();
  },[]);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <main className='main-container'>
        <div className='main-title'>
          <h3>Dashboard</h3>
        </div>

        <div className='main-cards'>
          <div className='card'>
            <div className='card-inner'>
              <h3>PROCESS OPENED</h3>
              <BsArrowRepeat className='card_icon' />
            </div>
            <h1>{ProcessesnumberO}</h1>
          </div>
          <div className='card'>
            <div className='card-inner'>
              <h3>PROCESS COMPLETED</h3>
              <BsCheckCircle className='card_icon' />
            </div>
            <h1>{ProcessesnumberC}</h1>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>CLIENTS</h3>
              <BsPeopleFill className="card_icon" />
            </div>
            <h1>{ClientNumber}</h1>
          </div>
          <div className='card'>
            <div className='card-inner'>
              <h3>MONEY COLLECTED</h3>
              <BsCash className='card_icon' />
            </div>
            <h1>{MoneyCollected}</h1>
          </div>
        </div>

        <div className='charts'>
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
                <Bar dataKey='plans' fill='#E178C5' background={{ fill: "transparent" }} />
              </BarChart>
            </ResponsiveContainer>
         </div>
          <div>
            <h3 style={{ textAlign: 'center' }}>Monthly Money Collected</h3>
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
                <Line type="monotone" dataKey="totalMoney" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomeC;
