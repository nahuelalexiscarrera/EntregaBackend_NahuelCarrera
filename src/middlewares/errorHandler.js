export const notFound = (req, res) => {
    res.status(404).json({ status: 'error', message: 'Recurso no encontrado' })
}

export const errorHandler = (err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ status: 'error', message: 'El body no es un JSON válido' })
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ status: 'error', message: 'Id inválido' })
    }
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message)
        return res.status(400).json({ status: 'error', message: messages.join('. ') })
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue ?? {})[0] ?? 'campo'
        return res.status(400).json({ status: 'error', message: `Valor duplicado en ${field}` })
    }
    console.error(err)
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' })
}
