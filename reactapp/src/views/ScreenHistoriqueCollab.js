import React,{useState} from 'react';
import '../App.css';
import {Button,Empty,Row,Col,Progress,Input,Form,List,Avatar,Tag,Typography,Modal,Image,Slider,Menu,Layout,Select} from 'antd'
import { UserOutlined,LaptopOutlined,NotificationOutlined,FrownOutlined,SmileOutlined,SendOutlined,HistoryOutlined,EditOutlined,EyeOutlined,LockOutlined,PlusOutlined,UserAddOutlined} from '@ant-design/icons';
import Nav from './Nav'

function ScreenDashboard(props) {
    const [visible, setVisible] = useState(false);
    const[feedbackOne,setFeedbackOne] = useState('');
    const[feedbackTwo,setFeedbackTwo] = useState('');
    const[moodValue,setMoodValue] = useState(1);
    
// Paramètres modale feedback mananger
    const showModal = () => {
        setVisible(true);
    };
    
    const handleOk = () => {
        console.log('test',feedbackOne)
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };
    
    var handleChange = (value) => {
        setMoodValue(value);
      };

    const { Header, Footer, Sider, Content } = Layout;
    const { Option } = Select;

  return (
      
    <div>

    <Layout>
        <Nav/>
        <Layout>
            <Sider style={{backgroundColor:'#D8E3E7'}}>
                <Row>
                    <Col span={22} offset={2}>
                        <Select defaultValue="Année" style={{width: 160, marginTop:20}} onChange={handleChange}>
                            <Option value="2021">2021</Option>
                            <Option value="2020">2020</Option>
                            <Option value="2019">2019</Option>
                            <Option value="2018">2018</Option>
                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Col span={22} offset={2} style={{marginTop:20}}>
                        <Typography.Text>Janvier</Typography.Text>
                        <EyeOutlined style={{ fontSize: '24px',marginRight:5, marginLeft:5}}/>
                    </Col>
                    <Col span={22} offset={2} style={{marginTop:20}}>
                        <Typography.Text>Février</Typography.Text>
                        <EyeOutlined style={{ fontSize: '24px',marginRight:5, marginLeft:5}}/>
                    </Col>
                    <Col span={22} offset={2} style={{marginTop:20}}>
                        <Typography.Text>Mars</Typography.Text>
                        <EyeOutlined style={{ fontSize: '24px',marginRight:5, marginLeft:5}}/>
                    </Col>
                </Row>
            </Sider>
            <Content>
                <Row>
                    <Col span={24} offset={0}>
                    <div className="icon-wrapper">
                        <FrownOutlined style={{color:'#A62626'}}/>
                        <Slider marks={{1:'1',2:'2',3:'3',4:'4',5:'5'}} step={1} value ={moodValue} 
                        min={1} max={5} onChange={(value) => handleChange(value)}/>
                        <SmileOutlined style={{color:'#448f30'}}/>
                    </div>
                    </Col>
                </Row>
            </Content>
        </Layout>
    </Layout>


    </div>
    );
}


export default ScreenDashboard;
