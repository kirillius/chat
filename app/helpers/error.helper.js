var _ = require('lodash');
var async = require('async');

var ErrorHelper = {
    getListErrorResponse: function (entityType, req, res) {
        return function (error) {
            ErrorHelper.errorResponse(res, error, {
                action: 'getList',
                logableType: entityType
            });
        }
    },
    showErrorResponse: function (entityType, req, res) {
        return function (error) {
            ErrorHelper.errorResponse(res, error, {
                action: 'show',
                objectLogId: req.params.id,
                logableType: entityType
            });
        }
    },
    createErrorResponse: function (entityType, req, res) {
        return function (error) {
            ErrorHelper.errorResponse(res, error, {
                action: 'create',
                objectLogId: req.body.id,
                logableType: entityType
            });
        }
    },
    updateErrorResponse: function (entityType, req, res) {
        return function (error) {
            ErrorHelper.errorResponse(res, error, {
                action: 'update',
                objectLogId: req.params.id,
                logableType: entityType
            });
        }
    },
    deleteErrorResponse: function (entityType, req, res) {
        return function (error) {
            ErrorHelper.errorResponse(res, error, {
                action: 'delete',
                objectLogId: req.params.id,
                logableType: entityType
            });
        }
    },
    copyWithChildErrorResponse: function (entityType, req, res) {
        return function (error) {
            ErrorHelper.errorResponse(res, error, {
                action: 'copyWithChild',
                objectLogId: req.body.id,
                logableType: entityType
            });
        }
    },
    copyErrorResponse: function (entityType, req, res) {
        return function (error) {
            ErrorHelper.errorResponse(res, error, {
                action: 'copyWithoutChild',
                objectLogId: req.body.id,
                logableType: entityType
            });
        }
    },

    actionErrorResponse: function (action, entityType, res, error) {
        ErrorHelper.errorResponse(res, error, {
            action: action,
            logableType: entityType
        });
    },
    // downloadFileErrorResponse: function (error, fileName, res) {
    //     ErrorHelper.errorResponse(res, error, {
    //         action: 'downloadFile',
    //         objectLogId: fileName,
    //         logableType: 'Asset'
    //     });
    //
    // },
    fileErrorResponse: function (entityType, req, res) {
        return function (error) {
            ErrorHelper.errorResponse(res, error, {
                action: 'File',
                logableType: 'File'
            });
        }
    },
    exportErrorResponse: function (entityType, req, res) {
        return function (error) {
            ErrorHelper.errorResponse(res, error, {
                action: 'Export',
                logableType: entityType
            });
        }
    },
    errorResponse: function (res, error, additionalInfo) {
        var Log = require('../models').log;

        var logObject = {
            textLog: error.toString()
        };
        _.extend(logObject, _.pick(additionalInfo, logFields));
        //Log.create(_.pick(logObject, logFields));

        var objError = {
            shortMessage: (additionalInfo.action=='delete') ? 'Элемент используется в карточках, удаление не возможно' : 'Возникла ошибка',
            messageException: error.toString()
        };

        res.status(500).json(objError);
    }
};

module.exports = ErrorHelper;