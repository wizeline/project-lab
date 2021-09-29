import styled from "@emotion/styled"

export const ProposalCardWrap = styled.div`
  .ProposalCard__head {
    display: flex;
    align-items: center;
  }
  .ProposalCard__head__icon {
    width: 60px;
    height: 60px;
    border: 2px solid #234cad;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: #234cad;
    font-size: 16px;
  }
  .ProposalCard__head__description {
    margin-left: 20px;
    width: calc(100% - 60px - 20px);
  }
  .ProposalCard__head__description--title {
    color: #234cad;
    font-weight: 700;
    font-size: 18px;
    line-height: 18px;
  }
  .ProposalCard__head__description--date {
    color: #234cad;
    font-weight: 700;
    font-size: 12px;
  }
  .ProposalCard--description {
    color: #727e8c;
    font-family: Poppins;
    font-size: 12px;
    letter-spacing: 0;
    line-height: 21px;
    margin-top: 10px;
    margin-bottom: 30px;
  }
  .ProposalCard--status {
    width: 75px;
    height: 25px;
    border-radius: 4px;
    position: absolute;
    bottom: 10px;
    right: 20px;
    color: #fff;
    text-align: center;
    font-size: 12px;
    line-height: 25px;
  }
`
