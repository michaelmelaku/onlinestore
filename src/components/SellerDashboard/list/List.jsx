import "./list.css";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { Button,  ButtonGroup} from "@mui/material";
import { setProductEditId,  setProfileEditId } from "../../../redux/reducers/editSlice";
import {useGetProductsQuery, useGetUserProfilesQuery, 
  useUpdateProductMutation, useUpdateUserProfileMutation, useGetOrdersQuery,
  useUpdateOrderMutation, useAddInvoiceMutation} from '../../../redux/services/apiSlice';
import {toast} from "react-toastify";
import HOC from "../../HOC";

const List = ({handleAdminPage, name, row,  columns}) => {
  const {data: products} = useGetProductsQuery();
  const {data: userProfile} = useGetUserProfilesQuery();
  const {data: orders} = useGetOrdersQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const [addInvoice] = useAddInvoiceMutation();
  
  const dispatch = useDispatch();

  const handleDisable = async (id) => {
    if(name==="Product"){
      await updateProduct({id, ...products, isActive: false});
      toast.warn("Product disabled!");
    }
    else if (name==="User"){
      await updateUserProfile({id, ...userProfile, isActive: false});
      toast.warn("User disabled!");
    }
  };
  const handleEnable = async (id) => {
    if(name==="Product"){
      await updateProduct({id, ...products, isActive: true});
      toast.success("Product enabled!");
    }
    else if (name==="User"){
      await updateUserProfile({id, ...userProfile, isActive: true});
      toast.success("User enabled!");
    }
  };

  const handleDeliver = async (id) => {
    await updateOrder({id, ...orders, orderStatus: 'Delivered'});
    const deliveredOrder = orders.find((order) => order._id === id);
    await addInvoice({
      invoiceItems: deliveredOrder.orderItems,
      customerName: deliveredOrder.shippingAddress.fullName,
      totalPrice: deliveredOrder.totalPrice,
      userId: deliveredOrder.userId
    });
    toast.success("Order is delivered!");
  }
  
  const handleEdit = (id) => {
    if(name==="Product") {
      handleAdminPage("newProduct")
      dispatch(setProductEditId(id));
    }
    else if (name==="User"){
      handleAdminPage("newUser");
      dispatch(setProfileEditId(id));
    }
  }

  const handleNew = () => {
    if(name==="Product"){
      handleAdminPage("newProduct");
    }
    else if (name==="User"){
      handleAdminPage("newUser");
    }
  }

  const handleStatus = async (id, status) => {
    await  updateOrder({id, ...orders, orderStatus: status});
    toast.success("Order status changed!");
  }

  const headerName =  name ==="Order" ? "" : "Action";
  const headerName1 = name ==="Order" ? "Action" :"";
  const width1 = name ==="Order" ? 0 : 120;
  const width2 = name ==="Order" ? 450: 150;
  
  const actionColumn = [
    {
      field: "edit",
      headerName: headerName,
      width:  width1,
      renderCell: (params) => {
        return (
             <>
               {name !=="Order" &&
                <div 
               className="editButton"
               onClick={() => handleEdit(params.row._id)}
            > 
               Edit {name}</div>
               }
             </>
        );
      },
    },
    {
      field: "disable",
      headerName: headerName1,
      width: width2,
      renderCell: (params) => {
        return (
          <div>
            {name==="Order" ? 
            <>
            {(params.row.orderStatus !=="Delivered") &&
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button onClick={() => handleDeliver(params.row._id, "Delivered")}>Deliver</Button>
              {params.row.orderStatus !=="Shipped" && <>
              <Button onClick={() => handleStatus(params.row._id, "Shipped")}>Ship</Button>
              <Button onClick={() => handleStatus(params.row._id, "Suspended")}>Suspend</Button>
              <Button onClick={() => handleStatus(params.row._id, "Refunded")}>Refund</Button>
              <Button onClick={() => handleStatus(params.row._id, "Canceled")}>Cancel</Button>
              </>}
            </ButtonGroup>
            }
            </>
            :
            <>
            {params.row.isActive ? 
              <div
              className="disableButton"
              onClick={() => handleDisable(params.row._id)}
            >
             Disable
            </div>:
            <div
              className="enableButton"
              onClick={() => handleEnable(params.row._id)}
            >
            Enable
            </div>}</>}
          </div>
        );
      },
    },
    
  ];
  return (
    <div className="datatable">
       {(name !=="Order" && name !=="Invoice") &&<div className="datatableTitle">
         Add New {name}
          <div  className="link" onClick={handleNew}>
          Add New
        </div>
      </div>}
        <DataGrid
            className="datagrid"
            rows={row ? row : []}
            getRowId={(row) => row?._id}
            disableSelectionOnClick
            columns={name ==="Invoice" ? columns : columns.concat(actionColumn)}
            pageSize={9}
            rowsPerPageOptions={[9]}
          />
    </div>
  );
};

export default HOC(List);