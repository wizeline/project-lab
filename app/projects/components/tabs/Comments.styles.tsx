import styled from "@emotion/styled"

export const Button = styled.button`
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
  border-radius: 4px;
  background-color: #ff6f18;
  color: #ffffff;
  font-family: Poppins;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 29px;
  padding: 17px 30px;
  text-align: center;
  user-select: none;
  cursor: pointer;
  border: none;
`
export const WrapperDialog = styled.div`
  display: block;
  margin: 5px;
  padding: 48px 52px 20px 13px;
`
export const ReplyButton = styled.span`
  font-size: 12px;
  color: #65676b;
  margin: 15px;
  display: block;
  &:hover {
    cursor: pointer;
  }
`
export const SaveReplyButton = styled(ReplyButton)`
  color: #fe6f18;
  display: block;
`
export const CommentTime = styled.span`
  margin-left: 5px;
  font-weight: 400;
  font-size: 13px;
  text-align: "left";
  color: gray;
  font-family: "Roboto", "Helvetica", "Arial", "sans-serif";
  line-height: 20px;
`
export const CommentBody = styled.span`
  font-style: italic;
  white-space: pre-line;
  font-size: 14px;
`
export const ReplyActions = styled.div`
  display: grid;
  grid-template-columns: 10% 90%;
  align-items: flex-end;
  grid-template-areas: "cancelBtn saveBtn";
`
