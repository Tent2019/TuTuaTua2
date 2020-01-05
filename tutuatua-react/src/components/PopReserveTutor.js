import React, {Component} from 'react';
import { Popover, Button } from 'antd';
import './PopReserve.css'
import Axios from '../config/axios.setup';

export class PopReserveTutor extends Component {

    state = {
        student: ''
    }

    handlePop = async () => {
        try {
            let result = await Axios.get('/getStudent/'+this.props.schedule.studentId)
            this.setState({ student: result.data },
                // () => console.log(this.state.student)
            )
        } catch (error) {
            console.log(error)
        }        
    }

    render() {        
        const {schedule, handleDeleteSchedule} = this.props
        const text = <div>
                        <b style={{color:'red', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <div>Price: {schedule.price} Baht</div>
                            <i className="fas fa-trash"
                                onClick={handleDeleteSchedule(schedule.id)}     
                                style={{ visibility: schedule.status ? 'hidden' : 'default'}}                                
                            ></i>  
                        </b>                       
                    </div>        
        let studentProfile = schedule.status ? 
            <div>
                <img style={{height:'100px',marginBottom:'10px'}} alt='' src={this.state.student.image}/>
                <div><b>Name: </b>{this.state.student.username}</div>
                <div><b>Telephone: </b>{this.state.student.telephone}</div>
                <div><b>Education: </b><br />
                    { this.state.student ?
                        this.state.student.education.map((edu,eduId) => <span key={eduId}>{edu.detail+' / '}</span>) : 
                        undefined
                    }
                </div>
            </div> : 'wait for booking ...' 
        return (           
            <Popover placement="right" trigger="click" 
                title={text} 
                content={studentProfile}
                onClick={ schedule.status ? this.handlePop : undefined}
            >    
                <Button id={schedule.id} className='confirm-button'
                    style={{ backgroundColor: schedule.status === false ? '#00ff99' : '#ff6666' }}                    
                >
                    {schedule.timeRange}
                </Button>
            </Popover>
        );
    }
}


