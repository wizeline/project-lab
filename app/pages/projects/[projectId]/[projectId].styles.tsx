import styled from "@emotion/styled"
import { Button } from "@mui/material"

export const HeaderInfo = styled.div`
  position: relative;
  .headerInfo--action {
    position: absolute;
    right: 13px;
  }
  .headerInfo--edit {
    padding-left: 15px;
    padding-right: 5px;
    display: inline-block;
  }
  .headerInfo--edit img {
    cursor: pointer;
    width: 25px;
    line-height: 44px;
    height: 44px;
    vertical-align: middle;
  }
  .titleProposal {
    text-align: center;
    max-width: 320px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 37px;
  }
  .titleProposal h1 {
    color: #252a2f;
    font-family: Poppins;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 30px;
    text-align: center;
  }
  .descriptionProposal {
    color: #000000;
    font-family: Poppins;
    font-size: 18px;
    letter-spacing: 0;
    line-height: 27px;
    padding-left: 24px;
    padding-right: 24px;
    margin-top: 15px;
  }
`

export const DetailMoreHead = styled.div`
  .itemHeadName {
    color: #000000;
    font-family: Poppins;
    font-size: 18px;
    letter-spacing: 0;
    line-height: 27px;
    display: inline-block;
  }
  .itemHeadValue {
    color: #000000;
    font-family: Poppins;
    font-size: 15px;
    letter-spacing: 0;
    line-height: 21px;
    display: inline-block;
  }
`

export default HeaderInfo
