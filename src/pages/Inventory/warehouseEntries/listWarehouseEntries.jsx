import React, { useState } from 'react'
import Select from 'react-select';
import { getWarehouse, getWarehouseEntries } from '../../../services/warehouseService';
import { useQuery } from 'react-query';
import { Container, Col, Row, Button, Table } from 'react-bootstrap';
import moment from 'moment';
const listWarehouseEntries = () => {

    const [warehouseId, setWarehouseId] = useState()
    const [warehouseConsult, setWarehouseConsult] = useState()

    const { data: warehouse, isLoading: warehouseLoading, isError: warehouseError } = useQuery('warehouse', getWarehouse);
    let warehouseOptions = []
    if (warehouse != null) {
        warehouseOptions = warehouse.map((warehouse) => ({
            value: warehouse.id,
            label: warehouse.description,
        }));
    }

    const consult = async () => {
        if (warehouseId) {
            let warehouse = await getWarehouseEntries(warehouseId).then(data=>data).then((data) => setWarehouseConsult(data));
            if (warehouse) {
                console.log(warehouse.entries.producerOrder.id)
                warehouse.entries.forEach(entry => {
                    console.log(entry.producerOrder.id)
                });
            }
        }
    }

    return (
        <>
            <Container>
                <Row>
                    <h1>Entradas por bodega</h1>
                </Row>
                <Row>
                    <Col>
                        <span>Seleccione la bodega a consultar:</span>

                    </Col>
                    <Col>
                        <Select
                            options={warehouseOptions}
                            placeholder='Seleccione'
                            onChange={(selected) => setWarehouseId(selected.value)}></Select>

                    </Col>
                    <Col>
                        <Button onClick={consult}>Consultar</Button>
                    </Col>
                </Row><br />
                <Row>
                    {
                        warehouseConsult ? (
                            warehouseConsult.entries ? (

                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Fecha de entrada</th>
                                            <th>Fecha de salida</th>
                                            <th>Cantidad:</th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>     
                                    {warehouseConsult.entries.map((entry) =>                                     
                                            <tr key={entry.id}> 
                                                <td>{entry.id}</td>
                                                <td>{moment(entry.entryDate).format("DD/MM/YYYY")}</td>
                                                <td>{moment(entry.expireDate).format("DD/MM/YYYY")}</td>
                                                <td>{entry.quantity}</td>
                                            </tr>                                      
                                    )}
                                    </tbody>
                                </Table>

                            ) : ("No alberga productos")

                        ) : ("")
                    }
                </Row>
            </Container>
        </>
    )
}

export default listWarehouseEntries