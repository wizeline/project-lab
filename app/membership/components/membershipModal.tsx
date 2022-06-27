import { useState } from "react"
import ModalBox from "../../core/components/ModalBox/index"
import checkMembership from "app/membership/queries/checkMembership"

const membershipModal = ({ idUser }) => {
  //   const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

  return (
    <>
      {/* <ModalBox
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        close={() => setOpenDeleteModal(false)}
      >
        <h2>
          Hey, it seems like you haven't been involved in these projects in a while. Are you still
          working on it?
        </h2>
      </ModalBox> */}
    </>
  )
}

export default membershipModal
