export interface OrderFee {
  id: number
  name: string
  value: number
  is_percentage: boolean
}

export interface User {
  id: number
  name: string
  avatar: string
  email: string
  phone: string
  wallet_address: string | null
  wallet_balance: string
}

export interface Order {
  id: number
  uuid: string
  user_id: number
  property_id: number
  status: string
  number_of_token: number
  booking_amount: string
  total_amount: string
  document_sign: boolean | null
  token_payment_is_done: boolean | null
  token_transferred: boolean
  fees: OrderFee[]
  user: User
  created_at: string
}

export interface OrderResponse {
  type: string
  message: string
  data: Order[]
  pager: {
    totalItems: number
    totalPages: number
    currentPage: number
    pageSize: number
    hasMore: boolean
  }
}



export interface KycData {
  Actions: {
    Document_Check: "Failed" | "Passed" | "Not Applicable" | "Completed";
    Human_Review_Compare: "Failed" | "Passed" | "Not Applicable" | "Completed";
    Human_Review_Document_Check: "Failed" | "Passed" | "Not Applicable" | "Completed";
    Human_Review_Liveness_Check: "Failed" | "Passed" | "Not Applicable" | "Completed";
    Liveness_Check: "Failed" | "Passed" | "Not Applicable" | "Completed";
    Register_Selfie: "Failed" | "Passed" | "Not Applicable" | "Completed";
    Return_Personal_Info: "Not Returned" | "Returned";
    Selfie_To_ID_Card_Compare: "Failed" | "Passed" | "Not Applicable" | "Completed";
    Verify_Document: "Failed" | "Passed" | "Not Applicable" | "Completed";
  };
  ImageLinks: {
    id_card_back: string;
    id_card_image: string;
    selfie_image: string;
  };
  PartnerParams: {
    job_id: string;
    user_id: string;
    job_type: number;
  };
  _id: string;
  ResultCode: string;
  ResultText: string;
  SmileJobID: string;
  signature: string;
  timestamp: string;
  __v: number;
}

export const mockKycData: KycData = {

  Actions: {
    Document_Check: "Passed",
    Human_Review_Compare: "Not Applicable",
    Human_Review_Document_Check: "Not Applicable",
    Human_Review_Liveness_Check: "Not Applicable",
    Liveness_Check: "Passed",
    Register_Selfie: "Passed",
    Return_Personal_Info: "Not Returned",
    Selfie_To_ID_Card_Compare: "Completed",
    Verify_Document: "Passed"
  },
  ImageLinks: {
      id_card_back : "https://smile-results-prod.s3.us-west-2.amazonaws.com/production/000000/2442/2442-0000000078-pjhcuvjyc60ut73jmhoxjdomn88wtu/SID_IDCard_Back.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA4OAOFXPABNPK57ZF%2F20250611%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250611T085357Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD%2BnxnIjwpeE1NJYKJiWTl4YR7ULsDR6fywtnXy%2BnuKDAIgE2TDap5dVAZWmtdVsCVtj5CHxmsBsua0F7N1bfyea2YqngMI0v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARADGgw4NTQ3MjgyMjc3NzYiDLyvyRCxtPhwyvv2TCryAiCVzMQr2hge9v5W5fH4QSCAh0rrgByozF3t7QwxhN3GiLDrU8KTP7ct1yOKHfwEu5h879CnCZhbMdsWTm31dBRzA%2FLMUH6qbhcNQBYd3lca%2BCgM5C8%2BqtaIBfgClqgQMhdxLChLtTALF7pQeK89AOqEQSOxfAoMiBRwRGRPEOPUS0A%2BDAQGanlEpkQNho7AQ1AX415fkbUAs8rL8606IiK1rN9KoDgCBsxMNGYWu0uQMQ%2BAISZcs8cwj9PRlXy2wYpYyKiox3pIholCFL0RDWLh%2FtrXZw%2FVKI1L5h9vuvZ0L%2Bk%2BVeHOmXm%2BVwGYw7QFVGt0jtvMYo7x57bN2%2FRn8QfRbVVfB5hTIAJTiypqKE38uu%2F5yeZyH%2BSJCBfGPlN9zbz3Auhtf0dZpp4NCgy5QFoIykLskqVF9At0qpK5qgczfAncwv1gV1iJmjinNeWJsT6QAUY7aNYUxdqWbquj89sCsQE2J%2BoVEGtafXASa3ch8Vsw8IOlwgY6nQEmNZ8QEmZj%2Bob9hhhfLqJ2Xpt7QAqEpmETXhtTJJ%2FJGQiw6RimAXfGNFO7M2YfMAyiCnPCXLtyqDpiU2xEyVRrwUkdcYHlBgL5%2BuP%2FfHWaPUfOen9z%2FdqLgyxU%2B81Q%2Fjcvq0VsK%2BvtvxHKL6JW8YoPpM5%2BhgmaXQZm%2FH9mqleHX3jq%2F%2FR%2BpGbjdroge6NCROh%2BTgbziIIeuvZVkpUi&X-Amz-Signature=93ebe108adc0b6a028d9d062da67a0a05187d44514f2bd8d37055c5cea8d08ce&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    id_card_image: "https://smile-results-prod.s3.us-west-2.amazonaws.com/production/000000/2442/2442-0000000078-pjhcuvjyc60ut73jmhoxjdomn88wtu/SID_IDCard.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA4OAOFXPABNPK57ZF%2F20250611%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250611T085357Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD%2BnxnIjwpeE1NJYKJiWTl4YR7ULsDR6fywtnXy%2BnuKDAIgE2TDap5dVAZWmtdVsCVtj5CHxmsBsua0F7N1bfyea2YqngMI0v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARADGgw4NTQ3MjgyMjc3NzYiDLyvyRCxtPhwyvv2TCryAiCVzMQr2hge9v5W5fH4QSCAh0rrgByozF3t7QwxhN3GiLDrU8KTP7ct1yOKHfwEu5h879CnCZhbMdsWTm31dBRzA%2FLMUH6qbhcNQBYd3lca%2BCgM5C8%2BqtaIBfgClqgQMhdxLChLtTALF7pQeK89AOqEQSOxfAoMiBRwRGRPEOPUS0A%2BDAQGanlEpkQNho7AQ1AX415fkbUAs8rL8606IiK1rN9KoDgCBsxMNGYWu0uQMQ%2BAISZcs8cwj9PRlXy2wYpYyKiox3pIholCFL0RDWLh%2FtrXZw%2FVKI1L5h9vuvZ0L%2Bk%2BVeHOmXm%2BVwGYw7QFVGt0jtvMYo7x57bN2%2FRn8QfRbVVfB5hTIAJTiypqKE38uu%2F5yeZyH%2BSJCBfGPlN9zbz3Auhtf0dZpp4NCgy5QFoIykLskqVF9At0qpK5qgczfAncwv1gV1iJmjinNeWJsT6QAUY7aNYUxdqWbquj89sCsQE2J%2BoVEGtafXASa3ch8Vsw8IOlwgY6nQEmNZ8QEmZj%2Bob9hhhfLqJ2Xpt7QAqEpmETXhtTJJ%2FJGQiw6RimAXfGNFO7M2YfMAyiCnPCXLtyqDpiU2xEyVRrwUkdcYHlBgL5%2BuP%2FfHWaPUfOen9z%2FdqLgyxU%2B81Q%2Fjcvq0VsK%2BvtvxHKL6JW8YoPpM5%2BhgmaXQZm%2FH9mqleHX3jq%2F%2FR%2BpGbjdroge6NCROh%2BTgbziIIeuvZVkpUi&X-Amz-Signature=32d4da01483605c5f9ef9492da8bee40908418d531884049002f63ba305f79fb&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    selfie_image: "https://smile-results-prod.s3.us-west-2.amazonaws.com/production/000000/2442/2442-0000000078-pjhcuvjyc60ut73jmhoxjdomn88wtu/SID_Preview_Full.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA4OAOFXPABNPK57ZF%2F20250611%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250611T085357Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCIQD%2BnxnIjwpeE1NJYKJiWTl4YR7ULsDR6fywtnXy%2BnuKDAIgE2TDap5dVAZWmtdVsCVtj5CHxmsBsua0F7N1bfyea2YqngMI0v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARADGgw4NTQ3MjgyMjc3NzYiDLyvyRCxtPhwyvv2TCryAiCVzMQr2hge9v5W5fH4QSCAh0rrgByozF3t7QwxhN3GiLDrU8KTP7ct1yOKHfwEu5h879CnCZhbMdsWTm31dBRzA%2FLMUH6qbhcNQBYd3lca%2BCgM5C8%2BqtaIBfgClqgQMhdxLChLtTALF7pQeK89AOqEQSOxfAoMiBRwRGRPEOPUS0A%2BDAQGanlEpkQNho7AQ1AX415fkbUAs8rL8606IiK1rN9KoDgCBsxMNGYWu0uQMQ%2BAISZcs8cwj9PRlXy2wYpYyKiox3pIholCFL0RDWLh%2FtrXZw%2FVKI1L5h9vuvZ0L%2Bk%2BVeHOmXm%2BVwGYw7QFVGt0jtvMYo7x57bN2%2FRn8QfRbVVfB5hTIAJTiypqKE38uu%2F5yeZyH%2BSJCBfGPlN9zbz3Auhtf0dZpp4NCgy5QFoIykLskqVF9At0qpK5qgczfAncwv1gV1iJmjinNeWJsT6QAUY7aNYUxdqWbquj89sCsQE2J%2BoVEGtafXASa3ch8Vsw8IOlwgY6nQEmNZ8QEmZj%2Bob9hhhfLqJ2Xpt7QAqEpmETXhtTJJ%2FJGQiw6RimAXfGNFO7M2YfMAyiCnPCXLtyqDpiU2xEyVRrwUkdcYHlBgL5%2BuP%2FfHWaPUfOen9z%2FdqLgyxU%2B81Q%2Fjcvq0VsK%2BvtvxHKL6JW8YoPpM5%2BhgmaXQZm%2FH9mqleHX3jq%2F%2FR%2BpGbjdroge6NCROh%2BTgbziIIeuvZVkpUi&X-Amz-Signature=e527c7d9e9d4d0bb129a5af1faf639bea218c71b6f729acb553e527fd1483899&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"
  },
  PartnerParams: {
    job_id: "job-f4ee5e5f-469b-4a5e-9a5c-d76e5fd14adb",
    user_id: "684814f5b5bd9bcc40e80880",
    job_type: 6
  },
  _id: "68494426517ef33ecccf0ad3",
  ResultCode: "0812",
  ResultText: "Unable to Verify Document - Failed Security Features Check",
  SmileJobID: "0000000078",
  signature: "bBBlm14I2eMgtIXMKcJFcVPbDBQYVgwVe8o7ZrLw9AQ=",
  timestamp: "2025-06-11T08:53:57.657Z",
  __v: 0

}