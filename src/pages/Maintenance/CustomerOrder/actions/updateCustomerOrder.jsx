import React, { useState, useEffect, useRef } from 'react'
import { QueryClient, useMutation, useQuery } from "react-query";
import { useParams } from 'react-router-dom'
import { format } from 'date-fns';
import Select from 'react-select';

import { getCostumerOrderById } from '../../../../services/costumerorderService';
import { editCostumerOrder } from '../../../../services/costumerorderService';

import { NavLink } from 'react-router-dom';

import styles from './updateCustomerOrder.css'

import { getCostumerOrder } from '../../../../services/costumerorderService';

const updateCustomerOrder = () => {
  const customerorder = useParams();
  const queryClient = new QueryClient();

  const [customerorderRequest, setCustomerorder] = useState(null)

  const { data, isLoading, isError } = useQuery('producerorder', getCostumerOrder);
if (data) {
  console.log(data)
}
  useEffect(() => {
    getCostumerOrderById(customerorder.customerorder, setCustomerorder)

  }, [])

  const mutation = useMutation("producerorder", editCostumerOrder,
    {
      onSettled: () => queryClient.invalidateQueries("producerorder"),
      mutationKey: "producerorder",
      onSuccess: () => history.back()
    })

  const [selectedPaid, setSelectedPaid] = useState(null);
  const [selectedDelivered, setSelectedDelivered] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);

  const optionsPaid = [
    { value: false, label: "Sin pagar" },
    { value: true, label: "Pagado" },
  ];

  const optionsDelivered = [
    { value: false, label: "No recibido" },
    { value: true, label: "Recibido" },
  ];



  const optionsStage = [
    { value: 1, label: "Sin confirmar" },
    { value: 2, label: "Confirmado" },
    { value: 3, label: "En preparación" },
    { value: 4, label: "En ruta de entrega" },
    { value: 5, label: "Entregado" },
    { value: 6, label: "Cancelado" },
    { value: 7, label: "Devuelto" },
  ];

  const paid = useRef();
  const delivered = useRef();
  const stage = useRef();


  const [optionStageFiltered, setStagesFiltered] = useState(null)

  useEffect(() => {
    if (customerorderRequest) {
      const isPaid = customerorderRequest.paidDate !== "0001-01-01T00:00:00";
      setSelectedPaid(optionsPaid.find(option => option.value === isPaid));

      const isDelivered = customerorderRequest.paidDelivered !== "0001-01-01T00:00:00";
      setSelectedDelivered(optionsDelivered.find(option => option.value === isDelivered));

      //Filter stages
      const findCurrentStage = optionsStage.find(optionsStage => optionsStage.label == customerorderRequest.stage)
      setSelectedStage(findCurrentStage.label);

      let currentState = optionsStage.find(stage => stage.label == customerorderRequest.stage)
      setStagesFiltered(optionsStage.filter(stage => stage.value <= (currentState.value+1) && stage.value >= currentState.value))

    }
  }, [customerorderRequest]);


  const saveEdit = () => {

    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');

    console.log("selectedStage " + selectedStage.value)

    let edit = {
      id: customerorderRequest.id,
      Total: customerorderRequest.total,
      CostumerId: customerorderRequest.costumerId,
      ConfirmedDate: customerorderRequest.confirmedDate,
      paidDate: selectedPaid.value == false ? "0001-01-01T00:00:00" : formattedDate,
      deliveredDate: selectedDelivered.value == false ? "0001-01-01T00:00:00" : formattedDate,
      Detail: customerorderRequest.detail,
      Stage: selectedStage != null ? selectedStage.label : customerorderRequest.stage,      
      address: customerorderRequest.address
    };

    console.log(edit)

    mutation.mutateAsync(edit);
    console.log(edit)
    limpiarInput()
  }
  const limpiarInput = () => {
    paid.current.value = "";
    delivered.current.value = "";
  }

  return (
    <div className='editContainer'>
      <h1>Editar estados del pedido</h1>

      <div className='editProductTextFields'>
        <div>
          <span>Estado de pago:</span>
          <Select
            options={optionsPaid}
            placeholder='Seleccione'
            name="state"
            id="1"
            ref={paid}
            onChange={(selectedOption) => setSelectedPaid(selectedOption)}
          />
        </div>

        <div>
          <span>Estado de entrega:</span>
          <Select
            options={optionsDelivered}
            placeholder='Seleccione'
            name="state"
            id="2"
            ref={delivered}
            onChange={(selectedOption) => setSelectedDelivered(selectedOption)}
          />
        </div>

        <div>
          <span>Seguimiento del pedido:</span>
          <Select
            options={optionStageFiltered}
            placeholder='Seleccione'
            name="state"
            id="3"
            ref={stage}
            onChange={(selectedOption) => setSelectedStage(selectedOption)}
          />
        </div>
      </div>

      <div className='editButtons'>
        <button onClick={saveEdit}>Aceptar</button>
        <NavLink to={'/listCustomerOrder/all'}>Regresar</NavLink>
      </div>
    </div>
  );
};

export default updateCustomerOrder