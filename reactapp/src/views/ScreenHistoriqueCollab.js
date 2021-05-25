import React,{useState,useEffect} from 'react';
import '../App.css';
import {Row,Col,Input,Typography,Slider,Layout,Select,Divider,message,Modal,Button, Menu, Dropdown} from 'antd'
import {StopOutlined,FrownOutlined,SmileOutlined,EyeOutlined,DownOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux';
import Nav from './Nav'
import _, { isArguments } from 'lodash';
import moment from 'moment';

function ScreenHistoriqueCollab(props) {
    const {Sider, Content} = Layout;
    const {Option} = Select;
    const [visibleModal, setVisibleModal] = useState(false);
    const [dataCollabFromBack, setDataCollabFromBack] = useState({matriochka:[{}]});
    const [year, setYear] = useState('')
    const [selectedListen, setSelectedListen] = useState({})
    const [firstSelectedListen, setFirstSelectedListen] = useState(true)

//Affichage modale de rappel du listen à remplir
    useEffect(() => {
        const startPage = ( async () => {
            if (props.shownModal == false){
                var rawResponse = await fetch(`/find-listen?id=${props.user._id}`);
                var foundListen = await rawResponse.json();
                if (foundListen.response == true){
                console.log('foundListen.response', foundListen.response)
                setVisibleModal(true)
                }
            }
            const data = await fetch('/matriochka/matriochka', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: `idFromFront=${props.userId._id}`
            })
            const body = await data.json()
            console.log(body)
            setDataCollabFromBack(body)
        })
        startPage();
    },[])

    let testDown = dataCollabFromBack.matriochka

    const handleCancel = () => {
        props.modalState()
        setVisibleModal(false);
    };

    function handleChange(value) {
        console.log("MATRIOCHKA = ",dataCollabFromBack)
        console.log("Test 2 = ", dataCollabFromBack.matriochka)
        console.log("Test 3 = ", dataCollabFromBack.matriochka[0][2021][0])
        console.log("year = ", year)
        setYear(value);
    }

    function chooseListen(listen) {
        //console.log("Test choose Listen = ",listen)
        let listenTemp = listen
        setFirstSelectedListen(false)
        setSelectedListen(listenTemp)
        console.log("SELECTED LISTEN = ", selectedListen)

    }

    const menu = (i, years, o, months) => (
        <Menu>
            {dataCollabFromBack.matriochka[i][_.findKey(years)][o][_.findKey(months)][0].map((days, p) => (
                <Menu.Item key={p}>
                    <Typography.Text onClick={() => chooseListen(days)}>{moment(days.createdAt).format('DD')}/{_.findKey(months)}/{_.findKey(years)}</Typography.Text>
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <div>
            <Layout style={{backgroundColor:'#FFFFFF'}}>
                <Nav/>
                <Layout style={{backgroundColor:'#FFFFFF'}}>
                    <Sider style={{backgroundColor:'#D8E3E7',height:"100vh"}}>
                        <Row>
                            <Col span={22} offset={2}>
                                <Select defaultValue="Année" style={{width: 160, marginTop:20}} onChange={handleChange}>
                                    {dataCollabFromBack.matriochka.map((years, i) => (
                                        <Option value={i}>{_.findKey(years)}</Option>
                                    ))}
                                </Select>
                            </Col>
                        </Row>

                        <Row type="flex" align-item="center">
                            {year === "" &&
                                <Col span={24} offset={0} style={{marginTop:20}} justify ="center" align="middle"></Col>
                            }    

                            {dataCollabFromBack.matriochka.map((years, i) => {
                                if (year === i) {
                                    return dataCollabFromBack.matriochka[i][_.findKey(years)].map((months, o) => (
                                        <Col span={24} offset={0} style={{marginTop:20}} justify ="center" align="middle">
                                            <Dropdown overlay={menu(i, years, o, months)} trigger={['click']}>
                                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                    {_.findKey(months)}/{_.findKey(years)} <DownOutlined />
                                                </a>
                                            </Dropdown>
                                        </Col>
                                    )) 
                                }
                            })}

                        </Row>
                    </Sider>
                    <Content>
                        {firstSelectedListen === true &&
                            <Col span={24} offset={0} justify="center" align="middle" style={{marginTop:25}}>
                                <Typography.Text> Veuillez choisir un Listen dans le menu déroulant à gauche</Typography.Text>
                            </Col>
                        }
                                
                        {firstSelectedListen === false &&
                                <Row>
                                <Col span={24} offset={0} justify="center" align="middle" style={{marginTop:20}}>
                                    <Typography.Text>{moment(selectedListen.createdAt).format('DD-MM-YYYY')}</Typography.Text>
                                </Col>
                                <Col span={24} offset={0}>
                                    <div className="icon-wrapper">
                                        <FrownOutlined style={{color:'#A62626'}}/>
                                        <Slider marks={{1:'1',2:'2',3:'3',4:'4',5:'5'}} step={1} value={selectedListen.mood} min={1} max={5}/>
                                        <SmileOutlined style={{color:'#448f30'}}/>
                                    </div>
                                </Col>
                                <Col span={22} offset={2}>
                                    <Col style={{marginBottom:4}}>
                                        <Typography.Text>Question 1</Typography.Text>
                                    </Col>
                                    <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder={selectedListen.answersCollab ? selectedListen.answersCollab[0].reponse1: "Vide"} disabled="true"/>
                                </Col>
                                <Col span={22} offset={2}>
                                    <Col style={{marginBottom:4}}>
                                        <Typography.Text>Question 2</Typography.Text>
                                    </Col>
                                    <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder={selectedListen.answersCollab ? selectedListen.answersCollab[0].reponse2: "Vide"} disabled="true"/>
                                </Col>
                                <Col span={22} offset={2}>
                                    <Col style={{marginBottom:4}}>
                                        <Typography.Text>Question 3</Typography.Text>
                                    </Col>
                                    <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder={selectedListen.answersCollab ? selectedListen.answersCollab[0].reponse3: "Vide"} disabled="true"/>
                                </Col>
                                <Col span={22} offset={2}>
                                    <Col style={{marginBottom:4}}>
                                        <Typography.Text>Question 4</Typography.Text>
                                    </Col>
                                    <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder={selectedListen.answersCollab ? selectedListen.answersCollab[0].reponse4: "Vide"} disabled="true"/>
                                </Col>
                                <Col span={22} offset={2}>
                                    <Col style={{marginBottom:4}}>
                                        <Typography.Text>Question 5</Typography.Text>
                                    </Col>
                                    <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder={selectedListen.answersCollab ? selectedListen.answersCollab[0].reponse5: "Vide"} disabled="true"/>
                                </Col>
                                <Divider>FeedBack Manager</Divider>
                                <Col span={22} offset={2}>
                                    <Col style={{marginBottom:4}}>
                                        <Typography.Text>FeedBack 1</Typography.Text>
                                    </Col>
                                    <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder={selectedListen.answersFeedback ? selectedListen.answersFeedback[0].feedback1: "Vide"} disabled="true"/>
                                </Col>
                                <Col span={22} offset={2}>
                                    <Col style={{marginBottom:4}}>
                                        <Typography.Text>FeedBack 2</Typography.Text>
                                    </Col>
                                    <Input style={{borderRadius: '5px', width:'90%', marginBottom:10}} placeholder={selectedListen.answersFeedback ? selectedListen.answersFeedback[0].feedback2: "Vide"} disabled="true"/>
                                </Col>
                            </Row>
                        }
                    </Content>
                    
                    <Modal visible={visibleModal} onCancel={handleCancel} footer={<Link to="/listen" ><Button key="back" onClick={props.modalState()}>
                        Remplir mon listen
                        </Button></Link>} width={700} height={500}>
                        <div style={{color:'red', display:'flex', justifyContent:'center'}}>
                            Bonjour, veuillez remplir votre Listen !
                        </div>
                    </Modal>
                </Layout>
            </Layout>
        </div>
    );
}

function mapStateToProps(state) {
    console.log('test userStore',state.user._id)
    return { userId: state.user }
}

function mapDispatchToProps(dispatch){
    return {
        modalState: function(){
            dispatch({type:"modalState"})
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScreenHistoriqueCollab);