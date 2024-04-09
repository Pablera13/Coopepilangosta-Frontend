import React, { useEffect, useState } from 'react'
import { Container} from 'react-bootstrap'
import CostumerProfile from './costumerProfile'
import EmployeeProfile from './employeeProfile'
import { validateLogStatus } from '../../../utils/validatePageAccess'


export const UserProfile = () => {
  const [isCostumer, setIsCostumer] = useState(false);
  const [isEmployee, setIesEmployee] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
            validateLogStatus()

        if (user.costumer != null) {
            setIsCostumer(true)
        }
        if (user.employee != null) {
            setIesEmployee(true)
        }
    
        
    }, [])

  return (
    <>
      <Container>
        {isCostumer ? (
          <CostumerProfile />
        ) : isEmployee ? (
          <EmployeeProfile />
        ) : (
          <div className="Loading">
          <ul>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        )}
      </Container>
    </>
  );
};
