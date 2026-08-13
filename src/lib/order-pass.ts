/** sessionStorage key holding the short-lived signed pass for an order. */
export const orderPassKey = (code: string) => `labomba.order.pass.${code}`;
