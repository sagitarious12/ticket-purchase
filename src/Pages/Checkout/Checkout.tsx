import React from 'react';
import './Checkout.scss';
import { Card } from '../../Components/Card/Card';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store/Store';
import { useNavigate } from 'react-router';
import { Concert } from '../../Types';
import { FormControl, FormGroup, FormGroupValue } from '../../Services';
import { Input } from '../../Components/Input/Input';
import { Button } from '../../Components/Button/Button';
import { ConcertActions } from '../../Store/reducers/concerts';

interface CheckoutForm {
  cardNumber: string;
  expirationDate: string;
  securityCode: string;
}

export const Checkout = () => {

  const concert: Concert = useSelector((state: RootState) => state.concertReducer.selectedConcert) as Concert;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [cardFG,] = React.useState(new FormGroup({
    cardNumber: new FormControl(''),
    expirationDate: new FormControl(''),
    securityCode: new FormControl('')
  }));
  const [quantityFG,] = React.useState(new FormGroup({
    quantity: new FormControl('1')
  }));
  const [quantityFormValue, setQuantityFormValue] = React.useState<{quantity: string}>({quantity: '1'});
  const [formValue, setFormValue] = React.useState<CheckoutForm>({} as CheckoutForm);

  const [savedCard, setSavedCard] = React.useState<boolean>(false);

  const serviceFee = 45.37;
  const processingFee = 2.86;


  React.useEffect(() => {
    if (!concert) {
      navigate('/');
    }
    cardFG.subscription.subscribe('CheckoutComponent', (formValue: FormGroupValue) => {
      setFormValue(formValue as any as CheckoutForm);
    });
    quantityFG.subscription.subscribe('QuantityCheckoutComponent', (formValue: FormGroupValue) => {
      setQuantityFormValue(formValue as any as {quantity: string});
    })
    return () => {
      cardFG.subscription.unsubscribe('CheckoutComponent');
      quantityFG.subscription.unsubscribe('QuantityCheckoutComponent')
      cardFG.destroy();
      quantityFG.destroy();

    }
  }, []);


  const getTicketsAvailableDate = (): string => {
    const date = new Date(concert?.date);
    return new Date(date.setDate(date.getDate() - 2)).toLocaleDateString();
  }

  const getTotalPrice = (): string => {
    const quantity = parseInt(quantityFormValue.quantity ? quantityFormValue.quantity : '1');
    const price = concert?.price;
    const ticketTotal = price * quantity;
    const serviceFeeTotal = serviceFee * quantity;
    return `$${Math.round((ticketTotal + serviceFeeTotal + processingFee) * 100) / 100}`;
  }

  const getTicketTotalPrice = (): string => {
    const quantity = parseInt(quantityFormValue.quantity ? quantityFormValue.quantity : '1');
    const price = concert?.price;
    return `$${Math.round((quantity * price) * 100) / 100}`;
  }

  const getServiceFeeTotal = (): string => {
    const quantity = parseInt(quantityFormValue.quantity ? quantityFormValue.quantity : '1');
    const serviceFeeTotal = serviceFee * quantity;
    return `$${Math.round((serviceFeeTotal) * 100) / 100}`;
  }

  return (
    <div data-testid="CheckoutWrapper" className="CheckoutWrapper">
      <div className="leftSection">
        <Card>
          <div className="DeliveryDetails">
            <h2>Delivery - {concert?.title} Tickets</h2>
            <h3>Mobile Entry - Free</h3>
            <p>Tickets Available: {getTicketsAvailableDate()}</p>
            <p>These mobile tickets will be transferred directly to you from a trusted seller. We'll email you instructions on how to accept them on the original ticket provider's mobile app.</p>
          </div>
        </Card>
        <Card>
          <div className="PaymentDetails">
            <h2>Payment</h2>
            <h3>Use Credit / Debit Card</h3>
            {
              savedCard ? (
                <Card background="#01040A">
                  <div className="CardDetails">
                    <h3>Using Card</h3>
                    <h4>Visa - {formValue.cardNumber.slice(formValue.cardNumber.length - 4, formValue.cardNumber.length)}</h4>
                    <p>Exp. {formValue.expirationDate}</p>
                    <br />
                    <Button
                      text='Remove Card'
                      onClick={() => {
                        setSavedCard(false); 
                        setFormValue({} as CheckoutForm);
                        (cardFG.controls.cardNumber as FormControl).onChange({target: {value: ''}} as React.ChangeEvent<HTMLInputElement>);
                        (cardFG.controls.expirationDate as FormControl).onChange({target: {value: ''}} as React.ChangeEvent<HTMLInputElement>);
                        (cardFG.controls.securityCode as FormControl).onChange({target: {value: ''}} as React.ChangeEvent<HTMLInputElement>);
                      }} 
                    />
                  </div>
                </Card>
              ) : (
                <Card background="#01040A">
                  <div className="CardDetails">
                    <Input
                      placeholder='Card Number'
                      formControl={cardFG.controls.cardNumber as FormControl}
                      type='text'
                    />
                    <Input 
                      placeholder='Expiration Date MM/YY'
                      formControl={cardFG.controls.expirationDate as FormControl}
                      type='text'
                    />
                    <Input
                      placeholder='Security Code'
                      formControl={cardFG.controls.securityCode as FormControl}
                      type="text"
                    />
                  </div>
                  <br />
                  <Button text='Save Card' onClick={() => {
                    setSavedCard(true);
                  }} />
                </Card>
              )
            }
          </div>
        </Card>
      </div>
      <div className="rightSection">
        <Card>
          <div className="TotalSection">
            <h2>Total</h2>
            <h2 style={{textAlign: 'right'}}>{getTotalPrice()}</h2>
          </div>
          <div className="QuantitySection">
            <Input 
              type="number"
              placeholder='quantity'
              formControl={quantityFG.controls.quantity as FormControl}
            />
          </div>
          <div className="TicketsSection">
            <h3>Tickets</h3>
            <p>Resale Tickets: ${concert?.price} * {quantityFormValue.quantity} = {getTicketTotalPrice()}</p>
          </div>
          <div className="SellerNotes">
            <h3>Notes From The Seller</h3>
            <p>{concert?.sellerNotes}</p>
          </div>
          <div className="Fees">
            <h3>Fees</h3>
            <p>Service Fee: ${serviceFee} x {quantityFormValue.quantity} = {getServiceFeeTotal()}</p>
            <p>Processing Fee: ${processingFee}</p>
          </div>
          <div className="CancelOrder">
            <h4 onClick={() => {
              dispatch(ConcertActions.deselectConcert());
              navigate('/');
            }}>Cancel Order</h4>
          </div>
          <br />
          <Button
            background="#238636"
            onClick={() => {
              alert('Order Has Been Placed! Thank you very much for taking a look at this!');
            }}
            text='Place Order'
          />
        </Card>
      </div>
    </div>
  )
}