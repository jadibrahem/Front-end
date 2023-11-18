import ProjectTables from "./components/ProjectTable";
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const Tables = () => {
  return (
    <Row>
      {/* --------------------------------------------------------------------------------*/}
      {/* table-1*/}
      {/* --------------------------------------------------------------------------------*/}
      <Col lg="12">
        <ProjectTables />
      </Col>
 
    </Row>
  );
};

export default Tables;
