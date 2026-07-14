class DomainError(Exception):
    ...


class NotFoundError(DomainError):
    ...


class DuplicateEmailError(DomainError):
    ...


class InvalidCredentialsError(DomainError):
    ...


class UnauthorizedError(DomainError):
    ...
