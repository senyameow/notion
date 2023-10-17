import React from 'react'

const DocPage = ({ params }: { params: { docId: string } }) => {
    return (
        <div className='pt-20'>
            {params.docId}
        </div>
    )
}

export default DocPage