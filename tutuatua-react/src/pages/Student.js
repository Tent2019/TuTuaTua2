import React, { Component } from 'react';
import './Student.css';
import { Descriptions, Tabs, Input, Button, Popover, Calendar, Card, List, Avatar } from 'antd';
import { PopReserveStudent } from '../components/PopReserveStudent';
import Axios from '../config/axios.setup';

// === Tab === //
const { TabPane } = Tabs;

// === Card === //
class Student extends Component {

  state = {
    // === profile === //
    username: '',
    telephone: '',
    image: '',
    edus: [],
    changeImage: '',
    tutors: [],
    appointment: [],

    // === calendar === //
    schedules: [], // { id: ,date: ,timeRange: , price: ,status:}   

    // === search === //
    search: '',

    // === comment === //
    comment: '',
  }

  // === Profile Function === //
  handleAddEdu = () => {
    this.setState(
      { edus: [...this.state.edus,{id:Math.round(Math.random()*1000)}] },
      // ()=>console.log(this.state.edus)
    )
  }
  handleChangeEdu = (targetId) => (e) => {
    this.setState(
      { 
        edus: this.state.edus.map(edu => edu.id === targetId ? 
          {...edu, detail: e.target.value} : edu) 
      },
      // ()=>console.log(this.state.edus)
    )
  }
  handleDeleteEdu = (targetId) => () => {
    this.setState(
      {edus: this.state.edus.filter(edu => edu.id !== targetId)},
      // ()=>console.log(this.state.edus)
    )
  }

  updateProfile = async () => {
    try {
        let result = await Axios.put('/updateProfile',{
          telephone: this.state.telephone,
          image: this.state.changeImage ? this.state.changeImage : this.state.image,
          edus: this.state.edus,
        })  
      console.log(result.data)
      this.setState({ changeImage: '' })
    } catch (err) {
      console.log(err)
    }   

    // refresh
    try {
      let result = await Axios.get('/getProfile')
      console.log(result.data)
      this.setState({
        image: result.data.image
      })
    } catch (error) {
      console.log(error)
    }  
  }
  
  // === Calendar Function === //
  dateCellRender = (moment) => {      

    let filterScheduleDay = (schedules) => {
      let result = schedules.filter(
        schedule => schedule.date.slice(3,5) == moment.date()
      )  
      result = result.filter(
        schedule => schedule.date.slice(0,2) == moment.month()+1
      )
      result = result.filter(
        schedule => schedule.date.slice(6) == moment.year()
      )
      return result
    }    

    let handleDeleteSchedule = (targerId) => async () => {
      try {
        let result = await Axios.delete('/deleteSchedule/'+targerId)
        console.log(result)

        // === refresh === //
        try {
          let resultSchedule = await Axios.get('/getSchedule')
          this.setState({ schedules: resultSchedule.data })
        } catch (error) {
          console.log(error)
        }  

      } catch (error) {
        console.log(error)
      }           
    }

    let handleReserveSchedule = async (targerId,tutorId) => {
      try {
        let result = await Axios.put('/reserveSchedule/'+targerId)
        console.log(result.data)

        // refresh
        let resultSchedule = await Axios.get('/getScheduleBySelectTutor/'+tutorId)
        this.setState({ schedules: resultSchedule.data })

        let resultAppointment = await Axios.get('/getScheduleByStudentId')
        this.setState({ appointment: resultAppointment.data })

      } catch (error) {
        console.log(error)
      }           
    }

    return (       
      <div>        
        {filterScheduleDay(this.state.schedules).map( schedule => 
          <PopReserveStudent key={schedule.id}
            schedule={schedule}      
            handleDeleteSchedule={handleDeleteSchedule}  
            handleReserveSchedule={handleReserveSchedule}    
          />
        )}             
      </div>    
    );
  }

  getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
  }
  monthCellRender = (value) => {
    const num = this.getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  }

  handleGetSchedule = (tutorId) => async () => {
    try {
      let resultSchedule = await Axios.get('/getScheduleBySelectTutor/'+tutorId)
      // console.log(resultSchedule.data)
      this.setState({ schedules: resultSchedule.data })
    } catch (error) {
      console.log(error)
    }    
  }

  numberTab = (key) => {
    // reset Calendar
    if (key !== '2' ) {
      this.setState({ schedules: [] })
    }
  } 

  // === @ Initiate === //

  componentDidMount = async () => {
    try {
      let resultProfile = await Axios.get('/getProfile')
      // console.log(resultProfile.data)
      this.setState({
        username: resultProfile.data.username,
        telephone: resultProfile.data.telephone,
        image: resultProfile.data.image,
        edus: resultProfile.data.education
      })

      let resultTutors = await Axios.get('/getTutors')
      // console.log(resultTutors.data)
      this.setState({ tutors: resultTutors.data })

      let resultSchedule = await Axios.get('/getScheduleByStudentId')
      // console.log(resultSchedule.data)
      this.setState({ appointment: resultSchedule.data })

    } catch (error) {
      console.log(error)
    }
  }

  // === ETC === //

  handleLogOut = () => {
    localStorage.removeItem('ACCESS_TOKEN')
    this.props.history.push('/login')
  }

  connectSkillandName = (objSkill,name) => {
    let connectText = '';
    for(let skill of objSkill) {
      connectText += skill.detail.toLowerCase()+' '
    }
    return connectText+name.toLowerCase()
  }

  handleComment = (tutorId) => async (e) => {
    if (e.key === 'Enter') {
      try {
        let result = await Axios.post('/createComment/'+tutorId,{
          text: this.state.comment
        }) 
        // console.log(result.data)ฝ
        this.setState({ comment: '' })
      } catch (error) {
        console.log(error)
      }      
    }    
  }

  render() {
    let filterTutors =  this.state.tutors ? 
      this.state.tutors.filter(tutor => 
        this.connectSkillandName(tutor.skills,tutor.username).includes(this.state.search)
      ): undefined
    return (
      <div id='container-student'> 
        
        <Tabs onChange={this.numberTab} type="card" >
          {/* Tab 1 */}
          <TabPane id='student-left-tab' tab="Profile" key="1">

            <Popover placement="right" title={'Image URL'} 
              content={<Input onChange={e => this.setState({ changeImage: e.target.value })}
                value={this.state.changeImage} 
              />} 
              trigger="click"
            >
              <div style={{height:'200px', marginBottom:'15px'}}>
                {this.state.image ?
                  <img id='img-profile' src={this.state.image} /> :
                  <div>Choose Image</div>
                }               
              </div>
            </Popover>                  
                     
            <Descriptions
              title={`Student ${this.state.username}`}
              bordered
              column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
              >

              <Descriptions.Item label='Telephone'>
                <Input className='student-input' 
                  placeholder='Type somthing ...' 
                  onChange={e => this.setState({telephone: e.target.value})}
                  value={this.state.telephone}
                />                              
              </Descriptions.Item>

              <Descriptions.Item label="Education">
                {this.state.edus.map((edu, index) =>
                  <Input key={edu.id}
                    className='student-input'
                    placeholder='Type somthing ...' 
                    onChange={this.handleChangeEdu(edu.id)}
                    value={edu.detail}
                    suffix = {<span id='write-delete'>
                      <i className="fas fa-trash"
                        onClick={this.handleDeleteEdu(edu.id)}
                      ></i>                      
                    </span>}
                  />                 
                )}
                <div className='addEdu' onClick={this.handleAddEdu} > 
                 ... 
                </div>
              </Descriptions.Item>  

            </Descriptions>                

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',
                        marginTop:'20px'}}
            >
              <Button onClick={this.updateProfile} >Save</Button>   
              <Button onClick={this.handleLogOut}>
                <i style={{fontSize:'15px'}} class="fas fa-sign-out-alt"></i>
              </Button>
            </div>

          </TabPane>

          {/* Tab 2 */}
          <TabPane id='student-center-tab' tab="Select Tutor" key="2"
            style={{textAlign:'center'}}
          >
            {/* search */}
            <Input 
              style={{width:'90%', margin:'0px 10px 20px'}}
              placeholder='search by SKILL or NAME'
              onChange={e => this.setState({ search: e.target.value })}
            />
            {/* tutors */}
            <div id='card-container'
              style={{border:'0px solid', height:'400px'}}
            >
              {filterTutors.map(tutor => 
                <Card key={tutor.id}
                  style={{ width: 140, border:'1px solid silver', marginBottom:'15px' }} 
                  cover={
                  <img alt="" src={tutor.image}
                    onClick={this.handleGetSchedule(tutor.id)}
                  />
                  }
                >
                  <div style={{height:'45px',overflow:'auto',textAlign:'left'}}>
                    <b>Name: </b><span>{tutor.username}</span><br />
                    <b>Tel: </b><span>{tutor.telephone}</span><br />
                    <b>Skill: </b>
                    {tutor.skills.map( (skill,skillId) => 
                      <span key={skillId}>{skill.detail+' / '}</span>
                    )}<br />   
                    <b>Education: </b>
                    {tutor.education.map( (edu,eduId) => 
                      <span key={eduId}>{edu.detail+' / '}</span>
                    )}<br />
                    <b>Awards: </b>
                    {tutor.awards.map( (award,awardId) => 
                      <span key={awardId}>{award.detail+' / '}</span>
                    )}<br />    
                    <b>Comment: </b>
                    <Input 
                      onChange={e => this.setState({ comment: e.target.value })}
                      onKeyUp={this.handleComment(tutor.id)}
                      value={this.state.comment}
                    />
                  </div>                              
                </Card>                
              )}           
            </div>            
          </TabPane>

          {/* Tab 3 */}
          <TabPane id='student-right-tab' tab="Schedule" key="3"
            style={{overflow:'auto'}}
          >
            <List
              itemLayout="horizontal"
              dataSource={this.state.appointment}              
              renderItem={item => (                                              
                <List.Item>         
                  <img alt='' src={item.user.image}
                    style={{height:'50px', width:'50px', margin:'0px 20px 0px 10px'}}
                  />
                  <List.Item.Meta
                    // avatar={<Avatar src={item.user.image} />}
                    title={`Name: ${item.user.username} / Tel: ${item.user.telephone}`}
                    description={<div><div>Date -> {item.date}</div><div>Time -> {item.timeRange}</div></div>}
                  />
                </List.Item>
              )}
            />
          </TabPane>

        </Tabs>        
            
        <Calendar 
            dateCellRender={this.dateCellRender} 
            monthCellRender={this.monthCellRender} 
        />         
        
      </div>
    );
  }
}

export default Student;